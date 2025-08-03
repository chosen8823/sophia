#!/usr/bin/env python3
"""
Simplified Sophiael AI Entry Point for Executable
This is a minimal version that can be packaged into an executable.
"""

import os
import sys
import logging
from pathlib import Path

# Add the current directory to the Python path
current_dir = Path(__file__).parent.absolute()
sys.path.insert(0, str(current_dir))

def setup_logging():
    """Setup basic logging for the application"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('sophiael.log'),
            logging.StreamHandler(sys.stdout)
        ]
    )

def check_dependencies():
    """Check if core dependencies are available"""
    required_modules = ['flask', 'flask_cors']
    missing = []
    
    for module in required_modules:
        try:
            __import__(module)
        except ImportError:
            missing.append(module)
    
    if missing:
        print(f"❌ Missing required modules: {', '.join(missing)}")
        print("\n📦 To install dependencies:")
        print("1. Run: pip install -r build_requirements.txt")
        print("2. Or run: python setup.py")
        print("3. Or install manually: pip install flask flask-cors")
        print("\n💡 Note: This is only needed for development.")
        print("   The final executable will include all dependencies.")
        return False
    return True

def create_minimal_app():
    """Create a minimal Flask application"""
    try:
        from flask import Flask, jsonify, send_from_directory, request
        from flask_cors import CORS
        import json
        import uuid
        from datetime import datetime
        
        app = Flask(__name__, static_folder='static')
        app.config['SECRET_KEY'] = 'sophiael_ai_secret_2025'
        
        # Enable CORS
        CORS(app, origins="*")
        
        # Simple in-memory storage for sessions
        chat_sessions = {}
        ai_responses = [
            "I understand your request and I'm here to help.",
            "That's an interesting question. Let me analyze it for you.",
            "Based on my understanding, I can provide insights on this topic.",
            "I'm processing your input using my AI capabilities.",
            "Thank you for reaching out. I'm ready to assist you.",
        ]
        
        @app.route('/')
        def index():
            """Serve the main application page"""
            return """
            <!DOCTYPE html>
            <html>
            <head>
                <title>Sophiael AI Platform</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
                    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
                    .header { text-align: center; color: white; margin-bottom: 40px; }
                    .main-content { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
                    .status { padding: 15px; background: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; margin: 20px 0; }
                    .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
                    .feature { padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff; transition: transform 0.2s; }
                    .feature:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                    .chat-section { margin-top: 30px; padding: 20px; background: #f0f8ff; border-radius: 8px; }
                    .chat-input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; margin: 10px 0; }
                    .btn { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; }
                    .btn:hover { background: #0056b3; }
                    .api-section { margin-top: 30px; padding: 20px; background: #2d3748; color: white; border-radius: 8px; }
                    .endpoint { background: #4a5568; padding: 10px; margin: 5px 0; border-radius: 4px; font-family: monospace; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🤖 Sophiael AI Platform</h1>
                        <p>Advanced AI System with Multi-Agent Capabilities</p>
                        <p>Executable Version 1.0.0</p>
                    </div>
                    
                    <div class="main-content">
                        <div class="status">
                            <strong>✅ System Status:</strong> Online and Ready | 
                            <strong>Server:</strong> http://localhost:5000 |
                            <strong>Build:</strong> Executable
                        </div>
                        
                        <div class="features">
                            <div class="feature">
                                <h3>🧠 AI Processing</h3>
                                <p>Intelligent response generation and natural language understanding</p>
                            </div>
                            <div class="feature">
                                <h3>💬 Chat Interface</h3>
                                <p>Interactive conversational AI with session management</p>
                            </div>
                            <div class="feature">
                                <h3>🔧 API Endpoints</h3>
                                <p>RESTful API for programmatic integration</p>
                            </div>
                            <div class="feature">
                                <h3>📊 Monitoring</h3>
                                <p>Real-time system health and performance tracking</p>
                            </div>
                        </div>
                        
                        <div class="chat-section">
                            <h3>💬 Quick Chat Test</h3>
                            <input type="text" id="chatInput" class="chat-input" placeholder="Type your message here...">
                            <button class="btn" onclick="sendMessage()">Send Message</button>
                            <div id="chatResponse" style="margin-top: 15px; padding: 10px; background: white; border-radius: 5px; min-height: 50px;">
                                <em>AI responses will appear here...</em>
                            </div>
                        </div>
                        
                        <div class="api-section">
                            <h3>🔗 API Endpoints</h3>
                            <div class="endpoint">GET /api/health - System health check</div>
                            <div class="endpoint">GET /api/info - Platform information</div>
                            <div class="endpoint">POST /api/chat - Send chat message</div>
                            <div class="endpoint">GET /api/sessions - List chat sessions</div>
                        </div>
                    </div>
                </div>
                
                <script>
                function sendMessage() {
                    const input = document.getElementById('chatInput');
                    const response = document.getElementById('chatResponse');
                    const message = input.value.trim();
                    
                    if (!message) return;
                    
                    response.innerHTML = '<em>Processing...</em>';
                    
                    fetch('/api/chat', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({message: message})
                    })
                    .then(r => r.json())
                    .then(data => {
                        response.innerHTML = '<strong>AI:</strong> ' + data.response;
                    })
                    .catch(e => {
                        response.innerHTML = '<strong>Error:</strong> ' + e.message;
                    });
                    
                    input.value = '';
                }
                
                document.getElementById('chatInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') sendMessage();
                });
                </script>
            </body>
            </html>
            """
        
        @app.route('/api/health')
        def health_check():
            """Health check endpoint"""
            return jsonify({
                "status": "healthy",
                "platform": "Sophiael AI Platform",
                "version": "1.0.0",
                "executable": True,
                "timestamp": datetime.now().isoformat(),
                "uptime": "running"
            })
        
        @app.route('/api/info')
        def platform_info():
            """Platform information endpoint"""
            return jsonify({
                "name": "Sophiael AI Platform",
                "description": "Advanced AI system with multi-agent capabilities",
                "version": "1.0.0",
                "build": "executable",
                "features": [
                    "Multi-Agent AI Processing",
                    "Chat Interface", 
                    "Session Management",
                    "RESTful API",
                    "Real-time Analytics",
                    "Standalone Executable"
                ],
                "endpoints": [
                    "/api/health",
                    "/api/info", 
                    "/api/chat",
                    "/api/sessions"
                ],
                "status": "operational"
            })
        
        @app.route('/api/chat', methods=['POST'])
        def chat():
            """Simple chat endpoint"""
            try:
                data = request.get_json()
                message = data.get('message', '')
                
                if not message:
                    return jsonify({"error": "No message provided"}), 400
                
                # Simple AI response simulation
                import random
                response = random.choice(ai_responses)
                response += f" You said: '{message}'"
                
                # Store in session (simple implementation)
                session_id = data.get('session_id', str(uuid.uuid4()))
                if session_id not in chat_sessions:
                    chat_sessions[session_id] = {
                        "id": session_id,
                        "created_at": datetime.now().isoformat(),
                        "messages": []
                    }
                
                chat_sessions[session_id]["messages"].append({
                    "user": message,
                    "ai": response,
                    "timestamp": datetime.now().isoformat()
                })
                
                return jsonify({
                    "response": response,
                    "session_id": session_id,
                    "success": True
                })
                
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        
        @app.route('/api/sessions')
        def list_sessions():
            """List chat sessions"""
            return jsonify({
                "sessions": list(chat_sessions.values()),
                "total": len(chat_sessions)
            })
        
        return app
        
    except ImportError as e:
        print(f"Error creating Flask app: {e}")
        return None

def main():
    """Main entry point for the Sophiael AI executable"""
    print("=" * 60)
    print("🤖 Sophiael AI Platform - Executable Version")
    print("=" * 60)
    
    setup_logging()
    
    if not check_dependencies():
        input("Press Enter to exit...")
        sys.exit(1)
    
    print("✅ Dependencies check passed")
    print("🚀 Starting Sophiael AI Platform...")
    
    app = create_minimal_app()
    if app is None:
        print("❌ Failed to create application")
        input("Press Enter to exit...")
        sys.exit(1)
    
    try:
        print("🌐 Server starting on http://localhost:5000")
        print("📝 Logs are saved to: sophiael.log")
        print("🛑 Press Ctrl+C to stop the server")
        print("-" * 60)
        
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=False,
            use_reloader=False
        )
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error running server: {e}")
        logging.error(f"Server error: {e}")
    finally:
        print("👋 Goodbye!")
        input("Press Enter to exit...")

if __name__ == '__main__':
    main()