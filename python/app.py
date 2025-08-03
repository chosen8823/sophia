"""
Main Flask application for the Sophia unified AI platform
Integrates OpenManus framework with Manus platform components
"""
import os
import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS

# Import our unified components
from src.models.user import db
from src.routes.user import user_bp
from src.routes.agents import agents_bp
from src.routes.chat import chat_bp
from src.routes.workflows import workflows_bp
from src.routes.tools import tools_bp

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__, 
                static_folder=os.path.join(os.path.dirname(__file__), 'static'),
                static_url_path='/static')
    
    app.config['SECRET_KEY'] = 'sophia_unified_platform_2025'
    
    # Enable CORS for all routes
    CORS(app, origins="*")
    
    # Register blueprints with API prefix
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(agents_bp, url_prefix='/api')
    app.register_blueprint(chat_bp, url_prefix='/api')
    app.register_blueprint(workflows_bp, url_prefix='/api')
    app.register_blueprint(tools_bp, url_prefix='/api')
    
    # Database configuration
    db_path = os.path.join(os.path.dirname(__file__), 'database', 'sophia.db')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    with app.app_context():
        db.create_all()
    
    @app.route('/api/health')
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "platform": "Sophia - Unified AI Platform",
            "version": "1.0.0",
            "timestamp": "2025-01-08",
            "components": {
                "openmanus_framework": "integrated",
                "manus_platform": "integrated", 
                "agent_system": "active",
                "chat_system": "active",
                "workflow_automation": "active",
                "tools_integration": "active"
            }
        })
    
    @app.route('/api/platform/info')
    def platform_info():
        """Platform information endpoint"""
        return jsonify({
            "name": "Sophia - Unified AI Platform",
            "description": "Integrated OpenManus framework with Manus platform capabilities",
            "version": "1.0.0",
            "architecture": "Unified Multi-Agent System",
            "features": [
                "OpenManus Agent Framework",
                "Free AI Models (Hugging Face, Local)",
                "OpenAI-Compatible API",
                "Advanced Agent SDK",
                "Multi-Agent Orchestration",
                "n8n Workflow Automation",
                "React Frontend Interface",
                "Real-time Chat System",
                "Tool Integration Layer",
                "Multi-modal Processing",
                "No API Limits"
            ],
            "supported_models": [
                "microsoft/DialoGPT-medium",
                "microsoft/DialoGPT-large", 
                "facebook/blenderbot-400M-distill",
                "sentence-transformers/all-MiniLM-L6-v2",
                "Custom OpenManus Models"
            ],
            "capabilities": [
                "Conversational AI",
                "Web Search & Scraping",
                "Code Generation & Analysis",
                "Data Analysis & Visualization", 
                "Creative Content Generation",
                "Strategic Planning",
                "Multi-Agent Collaboration",
                "Workflow Automation",
                "Image Processing",
                "Browser Automation",
                "Tool Integration"
            ],
            "integrations": [
                "OpenManus Framework",
                "Hugging Face Models",
                "n8n Workflows", 
                "Browser Automation",
                "Local LLM Support"
            ]
        })
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        """Serve React frontend files"""
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return "Frontend not configured", 404
        
        # If requesting a specific file that exists, serve it
        if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
            return send_from_directory(static_folder_path, path)
        else:
            # For SPA routing, always serve index.html
            index_path = os.path.join(static_folder_path, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(static_folder_path, 'index.html')
            else:
                # Fallback to a simple status page
                return jsonify({
                    "message": "Sophia Platform Backend Running",
                    "status": "Frontend not built yet",
                    "api_endpoints": [
                        "/api/health",
                        "/api/platform/info",
                        "/api/users",
                        "/api/agents", 
                        "/api/chat",
                        "/api/workflows",
                        "/api/tools"
                    ]
                })
    
    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    print("🚀 Starting Sophia - Unified AI Platform")
    print("📖 OpenManus Framework + Manus Platform Integration")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📚 API Documentation: http://localhost:5000/api/platform/info")
    
    app.run(host='0.0.0.0', port=5000, debug=True)