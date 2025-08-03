"""
Chat API routes for the Manus platform
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify, Response
import asyncio
import json
import uuid
from datetime import datetime

# Import OpenAI tools clone
try:
    from openai_tools_clone import app as openai_app
except ImportError:
    print("Warning: OpenAI tools clone not available, using mock")
    openai_app = None

chat_bp = Blueprint('chat', __name__)

# Chat history storage (in production, use a proper database)
chat_sessions = {}

@chat_bp.route('/chat/sessions', methods=['POST'])
def create_chat_session():
    """Create a new chat session"""
    try:
        data = request.get_json() or {}
        session_id = str(uuid.uuid4())
        
        chat_sessions[session_id] = {
            "id": session_id,
            "created_at": datetime.now().isoformat(),
            "messages": [],
            "model": data.get("model", "microsoft/DialoGPT-medium"),
            "title": data.get("title", "New Chat"),
            "metadata": data.get("metadata", {})
        }
        
        return jsonify({
            "success": True,
            "session": chat_sessions[session_id]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@chat_bp.route('/chat/sessions', methods=['GET'])
def list_chat_sessions():
    """List all chat sessions"""
    try:
        sessions = list(chat_sessions.values())
        # Sort by creation date, newest first
        sessions.sort(key=lambda x: x["created_at"], reverse=True)
        
        return jsonify({
            "success": True,
            "sessions": sessions,
            "total_count": len(sessions)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@chat_bp.route('/chat/sessions/<session_id>', methods=['GET'])
def get_chat_session(session_id):
    """Get specific chat session"""
    try:
        session = chat_sessions.get(session_id)
        if not session:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        return jsonify({
            "success": True,
            "session": session
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@chat_bp.route('/chat/sessions/<session_id>', methods=['DELETE'])
def delete_chat_session(session_id):
    """Delete chat session"""
    try:
        if session_id in chat_sessions:
            del chat_sessions[session_id]
            return jsonify({
                "success": True,
                "message": "Session deleted successfully"
            })
        else:
            return jsonify({"success": False, "error": "Session not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@chat_bp.route('/chat/sessions/<session_id>/messages', methods=['POST'])
def send_message_to_session(session_id):
    """Send message to chat session"""
    try:
        session = chat_sessions.get(session_id)
        if not session:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        data = request.get_json()
        message = data.get('message', '')
        model = data.get('model', session.get('model', 'microsoft/DialoGPT-medium'))
        stream = data.get('stream', False)
        
        if not message:
            return jsonify({"success": False, "error": "Message is required"}), 400
        
        # Add user message to session
        user_message = {
            "id": str(uuid.uuid4()),
            "role": "user",
            "content": message,
            "timestamp": datetime.now().isoformat()
        }
        session["messages"].append(user_message)
        
        # Prepare messages for OpenAI API format
        api_messages = [{"role": msg["role"], "content": msg["content"]} for msg in session["messages"]]
        
        # Call our OpenAI tools clone
        import requests
        
        try:
            response = requests.post(
                "http://localhost:8000/v1/chat/completions",
                json={
                    "model": model,
                    "messages": api_messages,
                    "stream": stream,
                    "max_tokens": 512,
                    "temperature": 0.7
                },
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                if stream:
                    # Handle streaming response
                    def generate_stream():
                        for line in response.iter_lines():
                            if line:
                                yield line.decode('utf-8') + '\n'
                    
                    return Response(generate_stream(), mimetype='text/plain')
                else:
                    # Handle non-streaming response
                    result = response.json()
                    assistant_content = result["choices"][0]["message"]["content"]
                    
                    # Add assistant message to session
                    assistant_message = {
                        "id": str(uuid.uuid4()),
                        "role": "assistant",
                        "content": assistant_content,
                        "timestamp": datetime.now().isoformat(),
                        "model": model,
                        "usage": result.get("usage", {})
                    }
                    session["messages"].append(assistant_message)
                    
                    return jsonify({
                        "success": True,
                        "message": assistant_message,
                        "session_id": session_id,
                        "usage": result.get("usage", {})
                    })
            else:
                # Fallback response
                assistant_message = {
                    "id": str(uuid.uuid4()),
                    "role": "assistant",
                    "content": "I'm experiencing some technical difficulties. Please try again.",
                    "timestamp": datetime.now().isoformat(),
                    "model": model,
                    "error": True
                }
                session["messages"].append(assistant_message)
                
                return jsonify({
                    "success": True,
                    "message": assistant_message,
                    "session_id": session_id,
                    "warning": "Fallback response due to API issues"
                })
                
        except requests.exceptions.RequestException:
            # Fallback when OpenAI tools clone is not available
            assistant_message = {
                "id": str(uuid.uuid4()),
                "role": "assistant",
                "content": f"Hello! I received your message: '{message}'. I'm a Manus AI assistant powered by free models. How can I help you today?",
                "timestamp": datetime.now().isoformat(),
                "model": model,
                "fallback": True
            }
            session["messages"].append(assistant_message)
            
            return jsonify({
                "success": True,
                "message": assistant_message,
                "session_id": session_id,
                "info": "Using fallback response - OpenAI tools service not available"
            })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@chat_bp.route('/chat/completions', methods=['POST'])
def chat_completions():
    """OpenAI-compatible chat completions endpoint"""
    try:
        data = request.get_json()
        
        # Forward to our OpenAI tools clone
        import requests
        
        try:
            response = requests.post(
                "http://localhost:8000/v1/chat/completions",
                json=data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                return jsonify(response.json())
            else:
                return jsonify({"error": "OpenAI tools service error"}), response.status_code
                
        except requests.exceptions.RequestException:
            # Fallback response
            messages = data.get("messages", [])
            last_message = messages[-1]["content"] if messages else "Hello"
            
            return jsonify({
                "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
                "object": "chat.completion",
                "created": int(datetime.now().timestamp()),
                "model": data.get("model", "microsoft/DialoGPT-medium"),
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": f"I received your message: '{last_message}'. I'm a Manus AI assistant. How can I help you?"
                    },
                    "finish_reason": "stop"
                }],
                "usage": {
                    "prompt_tokens": 10,
                    "completion_tokens": 20,
                    "total_tokens": 30
                }
            })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chat_bp.route('/chat/models', methods=['GET'])
def list_chat_models():
    """List available chat models"""
    try:
        models = [
            {
                "id": "microsoft/DialoGPT-medium",
                "name": "DialoGPT Medium",
                "description": "Microsoft's conversational AI model",
                "provider": "Hugging Face",
                "type": "chat",
                "free": True
            },
            {
                "id": "microsoft/DialoGPT-large",
                "name": "DialoGPT Large", 
                "description": "Larger version of Microsoft's conversational AI",
                "provider": "Hugging Face",
                "type": "chat",
                "free": True
            },
            {
                "id": "facebook/blenderbot-400M-distill",
                "name": "BlenderBot 400M",
                "description": "Facebook's conversational AI model",
                "provider": "Hugging Face", 
                "type": "chat",
                "free": True
            },
            {
                "id": "orca-mini-3b-gguf2-q4_0.gguf",
                "name": "Orca Mini 3B",
                "description": "Local GPT4All model",
                "provider": "GPT4All",
                "type": "chat",
                "free": True,
                "local": True
            }
        ]
        
        return jsonify({
            "success": True,
            "models": models,
            "total_count": len(models)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@chat_bp.route('/chat/export/<session_id>', methods=['GET'])
def export_chat_session(session_id):
    """Export chat session"""
    try:
        session = chat_sessions.get(session_id)
        if not session:
            return jsonify({"success": False, "error": "Session not found"}), 404
        
        # Create export data
        export_data = {
            "session_id": session_id,
            "title": session.get("title", "Chat Export"),
            "created_at": session["created_at"],
            "exported_at": datetime.now().isoformat(),
            "model": session.get("model"),
            "message_count": len(session["messages"]),
            "messages": session["messages"]
        }
        
        return jsonify({
            "success": True,
            "export": export_data
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@chat_bp.route('/chat/clear', methods=['POST'])
def clear_all_sessions():
    """Clear all chat sessions"""
    try:
        session_count = len(chat_sessions)
        chat_sessions.clear()
        
        return jsonify({
            "success": True,
            "message": f"Cleared {session_count} chat sessions"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

