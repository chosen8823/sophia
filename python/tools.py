"""
Tools API routes for the Manus platform
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from flask import Blueprint, request, jsonify
import asyncio
import json
from datetime import datetime

tools_bp = Blueprint('tools', __name__)

@tools_bp.route('/tools', methods=['GET'])
def list_available_tools():
    """List all available tools"""
    try:
        tools = [
            {
                "id": "web_search",
                "name": "Web Search",
                "description": "Search the web for real-time information",
                "category": "search",
                "parameters": [
                    {"name": "query", "type": "string", "required": True, "description": "Search query"},
                    {"name": "max_results", "type": "integer", "required": False, "description": "Maximum number of results"}
                ]
            },
            {
                "id": "code_generation",
                "name": "Code Generation",
                "description": "Generate, analyze, and optimize code",
                "category": "development",
                "parameters": [
                    {"name": "task", "type": "string", "required": True, "description": "Code generation task"},
                    {"name": "language", "type": "string", "required": False, "description": "Programming language"},
                    {"name": "complexity", "type": "string", "required": False, "description": "Code complexity level"}
                ]
            },
            {
                "id": "data_analysis",
                "name": "Data Analysis",
                "description": "Analyze data and create insights",
                "category": "analytics",
                "parameters": [
                    {"name": "data", "type": "any", "required": True, "description": "Data to analyze"},
                    {"name": "analysis_type", "type": "string", "required": False, "description": "Type of analysis"}
                ]
            },
            {
                "id": "creative_writing",
                "name": "Creative Writing",
                "description": "Generate creative content and writing",
                "category": "creative",
                "parameters": [
                    {"name": "prompt", "type": "string", "required": True, "description": "Writing prompt"},
                    {"name": "style", "type": "string", "required": False, "description": "Writing style"},
                    {"name": "length", "type": "string", "required": False, "description": "Content length"}
                ]
            },
            {
                "id": "image_analysis",
                "name": "Image Analysis",
                "description": "Analyze and understand images",
                "category": "vision",
                "parameters": [
                    {"name": "image_path", "type": "string", "required": True, "description": "Path to image file"},
                    {"name": "analysis_type", "type": "string", "required": False, "description": "Type of analysis"}
                ]
            },
            {
                "id": "planning",
                "name": "Strategic Planning",
                "description": "Create strategic plans and manage projects",
                "category": "planning",
                "parameters": [
                    {"name": "goal", "type": "string", "required": True, "description": "Planning goal"},
                    {"name": "timeframe", "type": "string", "required": False, "description": "Project timeframe"},
                    {"name": "complexity", "type": "string", "required": False, "description": "Project complexity"}
                ]
            },
            {
                "id": "spiritual_guidance",
                "name": "Spiritual Guidance",
                "description": "Provide spiritual guidance and divine alignment",
                "category": "spiritual",
                "parameters": [
                    {"name": "query", "type": "string", "required": True, "description": "Spiritual question or concern"},
                    {"name": "context", "type": "string", "required": False, "description": "Additional context"}
                ]
            },
            {
                "id": "emotional_intelligence",
                "name": "Emotional Intelligence",
                "description": "Analyze emotions and provide emotional support",
                "category": "emotional",
                "parameters": [
                    {"name": "text", "type": "string", "required": True, "description": "Text to analyze"},
                    {"name": "analysis_type", "type": "string", "required": False, "description": "Type of emotional analysis"}
                ]
            }
        ]
        
        return jsonify({
            "success": True,
            "tools": tools,
            "total_count": len(tools),
            "categories": list(set(tool["category"] for tool in tools))
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@tools_bp.route('/tools/<tool_id>/execute', methods=['POST'])
def execute_tool(tool_id):
    """Execute a specific tool"""
    try:
        data = request.get_json() or {}
        
        # Import tool classes
        from advanced_agent import (
            WebSearchTool, CodeGenerationTool, DataAnalysisTool, 
            CreativeWritingTool, ImageAnalysisTool, PlanningTool
        )
        from agent_sdk import SpiritualGuidanceTool, EmotionalIntelligenceTool
        
        # Create tool instance based on tool_id
        tool_map = {
            "web_search": WebSearchTool(),
            "code_generation": CodeGenerationTool(),
            "data_analysis": DataAnalysisTool(),
            "creative_writing": CreativeWritingTool(),
            "image_analysis": ImageAnalysisTool(),
            "planning": PlanningTool(),
            "spiritual_guidance": SpiritualGuidanceTool(),
            "emotional_intelligence": EmotionalIntelligenceTool()
        }
        
        tool = tool_map.get(tool_id)
        if not tool:
            return jsonify({"success": False, "error": f"Tool '{tool_id}' not found"}), 404
        
        # Execute tool with parameters
        async def run_tool():
            if tool_id == "web_search":
                result = await tool.execute(
                    query=data.get("query", ""),
                    max_results=data.get("max_results", 5)
                )
            elif tool_id == "code_generation":
                result = await tool.execute(
                    task=data.get("task", ""),
                    language=data.get("language", "python"),
                    complexity=data.get("complexity", "medium")
                )
            elif tool_id == "data_analysis":
                result = await tool.execute(
                    data=data.get("data", ""),
                    analysis_type=data.get("analysis_type", "descriptive")
                )
            elif tool_id == "creative_writing":
                result = await tool.execute(
                    prompt=data.get("prompt", ""),
                    style=data.get("style", "professional"),
                    length=data.get("length", "medium")
                )
            elif tool_id == "image_analysis":
                result = await tool.execute(
                    image_path=data.get("image_path", ""),
                    analysis_type=data.get("analysis_type", "general")
                )
            elif tool_id == "planning":
                result = await tool.execute(
                    goal=data.get("goal", ""),
                    timeframe=data.get("timeframe", "3 months"),
                    complexity=data.get("complexity", "medium")
                )
            elif tool_id == "spiritual_guidance":
                result = await tool.execute(
                    query=data.get("query", ""),
                    context=data.get("context", "")
                )
            elif tool_id == "emotional_intelligence":
                result = await tool.execute(
                    text=data.get("text", ""),
                    analysis_type=data.get("analysis_type", "sentiment")
                )
            else:
                result = {"error": "Tool execution not implemented"}
            
            return result
        
        # Run async function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(run_tool())
        finally:
            loop.close()
        
        return jsonify({
            "success": True,
            "tool_id": tool_id,
            "tool_name": tool.name,
            "result": result,
            "executed_at": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@tools_bp.route('/tools/categories', methods=['GET'])
def get_tool_categories():
    """Get tool categories"""
    try:
        categories = [
            {
                "id": "search",
                "name": "Search & Research",
                "description": "Tools for searching and researching information",
                "tools": ["web_search"]
            },
            {
                "id": "development",
                "name": "Development & Programming",
                "description": "Tools for code generation and development",
                "tools": ["code_generation"]
            },
            {
                "id": "analytics",
                "name": "Data & Analytics",
                "description": "Tools for data analysis and insights",
                "tools": ["data_analysis"]
            },
            {
                "id": "creative",
                "name": "Creative & Content",
                "description": "Tools for creative writing and content generation",
                "tools": ["creative_writing"]
            },
            {
                "id": "vision",
                "name": "Vision & Image",
                "description": "Tools for image analysis and computer vision",
                "tools": ["image_analysis"]
            },
            {
                "id": "planning",
                "name": "Planning & Strategy",
                "description": "Tools for strategic planning and project management",
                "tools": ["planning"]
            },
            {
                "id": "spiritual",
                "name": "Spiritual & Wisdom",
                "description": "Tools for spiritual guidance and divine wisdom",
                "tools": ["spiritual_guidance"]
            },
            {
                "id": "emotional",
                "name": "Emotional Intelligence",
                "description": "Tools for emotional analysis and support",
                "tools": ["emotional_intelligence"]
            }
        ]
        
        return jsonify({
            "success": True,
            "categories": categories,
            "total_count": len(categories)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@tools_bp.route('/tools/openai/models', methods=['GET'])
def get_openai_models():
    """Get available OpenAI-compatible models"""
    try:
        import requests
        
        try:
            # Try to get models from our OpenAI tools clone
            response = requests.get("http://localhost:8000/v1/models", timeout=5)
            if response.status_code == 200:
                models_data = response.json()
                return jsonify({
                    "success": True,
                    "models": models_data.get("data", []),
                    "source": "openai_tools_clone"
                })
        except requests.exceptions.RequestException:
            pass
        
        # Fallback model list
        fallback_models = [
            {
                "id": "microsoft/DialoGPT-medium",
                "object": "model",
                "created": int(datetime.now().timestamp()),
                "owned_by": "huggingface"
            },
            {
                "id": "microsoft/DialoGPT-large",
                "object": "model", 
                "created": int(datetime.now().timestamp()),
                "owned_by": "huggingface"
            },
            {
                "id": "facebook/blenderbot-400M-distill",
                "object": "model",
                "created": int(datetime.now().timestamp()),
                "owned_by": "huggingface"
            }
        ]
        
        return jsonify({
            "success": True,
            "models": fallback_models,
            "source": "fallback"
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@tools_bp.route('/tools/openai/chat/completions', methods=['POST'])
def openai_chat_completions():
    """OpenAI-compatible chat completions endpoint"""
    try:
        data = request.get_json()
        
        import requests
        
        try:
            # Forward to our OpenAI tools clone
            response = requests.post(
                "http://localhost:8000/v1/chat/completions",
                json=data,
                headers={"Content-Type": "application/json"},
                timeout=30
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
                "id": f"chatcmpl-fallback",
                "object": "chat.completion",
                "created": int(datetime.now().timestamp()),
                "model": data.get("model", "microsoft/DialoGPT-medium"),
                "choices": [{
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": f"I'm a Manus AI assistant. I received: '{last_message}'. How can I help you today?"
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

@tools_bp.route('/tools/openai/embeddings', methods=['POST'])
def openai_embeddings():
    """OpenAI-compatible embeddings endpoint"""
    try:
        data = request.get_json()
        
        import requests
        
        try:
            # Forward to our OpenAI tools clone
            response = requests.post(
                "http://localhost:8000/v1/embeddings",
                json=data,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code == 200:
                return jsonify(response.json())
            else:
                return jsonify({"error": "OpenAI tools service error"}), response.status_code
                
        except requests.exceptions.RequestException:
            # Fallback response
            input_text = data.get("input", "")
            if isinstance(input_text, list):
                input_text = input_text[0] if input_text else ""
            
            # Create dummy embedding
            dummy_embedding = [0.1] * 384  # Common embedding size
            
            return jsonify({
                "object": "list",
                "data": [{
                    "object": "embedding",
                    "embedding": dummy_embedding,
                    "index": 0
                }],
                "model": data.get("model", "sentence-transformers/all-MiniLM-L6-v2"),
                "usage": {
                    "prompt_tokens": len(input_text.split()),
                    "total_tokens": len(input_text.split())
                }
            })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@tools_bp.route('/tools/status', methods=['GET'])
def get_tools_status():
    """Get tools system status"""
    try:
        # Check OpenAI tools clone availability
        openai_tools_available = False
        try:
            import requests
            response = requests.get("http://localhost:8000/health", timeout=5)
            openai_tools_available = response.status_code == 200
        except:
            pass
        
        status = {
            "tools_available": 8,
            "categories_available": 8,
            "openai_tools_clone_running": openai_tools_available,
            "openai_tools_url": "http://localhost:8000" if openai_tools_available else None,
            "supported_models": [
                "microsoft/DialoGPT-medium",
                "microsoft/DialoGPT-large",
                "facebook/blenderbot-400M-distill",
                "sentence-transformers/all-MiniLM-L6-v2"
            ],
            "capabilities": [
                "Web Search",
                "Code Generation", 
                "Data Analysis",
                "Creative Writing",
                "Image Analysis",
                "Strategic Planning",
                "Spiritual Guidance",
                "Emotional Intelligence"
            ],
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify({
            "success": True,
            "status": status
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

