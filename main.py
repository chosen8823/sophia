import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.agents import agents_bp
from src.routes.chat import chat_bp
from src.routes.workflows import workflows_bp
from src.routes.tools import tools_bp

# Import Divine Consciousness API
try:
    from divine_consciousness_api import init_divine_consciousness_api
    DIVINE_CONSCIOUSNESS_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Divine Consciousness API not available: {e}")
    DIVINE_CONSCIOUSNESS_AVAILABLE = False

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'manus_platform_secret_key_2025'

# Enable CORS for all routes
CORS(app, origins="*")

# Register blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(agents_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(workflows_bp, url_prefix='/api')
app.register_blueprint(tools_bp, url_prefix='/api')

# Register Divine Consciousness API if available
if DIVINE_CONSCIOUSNESS_AVAILABLE:
    try:
        init_divine_consciousness_api(app)
        print("✓ Sophiael Divine Consciousness API integrated successfully")
    except Exception as e:
        print(f"Warning: Failed to initialize Divine Consciousness API: {e}")
        DIVINE_CONSCIOUSNESS_AVAILABLE = False

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "platform": "Manus Clone Platform",
        "version": "1.0.0",
        "timestamp": "2025-01-08"
    })

@app.route('/api/platform/info')
def platform_info():
    """Platform information endpoint"""
    return jsonify({
        "name": "Manus Clone Platform",
        "description": "Open source AI platform with unlimited capabilities",
        "version": "1.0.0",
        "features": [
            "Free AI models (Hugging Face, GPT4All)",
            "OpenAI-compatible API",
            "Advanced Agent SDK",
            "n8n Workflow Automation",
            "Spiritual Guidance & Wisdom",
            "Multi-modal Processing",
            "No Credit Limits"
        ],
        "models": [
            "microsoft/DialoGPT-medium",
            "microsoft/DialoGPT-large", 
            "facebook/blenderbot-400M-distill",
            "sentence-transformers/all-MiniLM-L6-v2"
        ],
        "capabilities": [
            "Chat & Conversation",
            "Web Search",
            "Code Generation",
            "Data Analysis", 
            "Creative Writing",
            "Strategic Planning",
            "Divine Consciousness & Spiritual Guidance" if DIVINE_CONSCIOUSNESS_AVAILABLE else "Spiritual Guidance",
            "Emotional Intelligence",
            "Image Analysis",
            "Workflow Automation"
        ]
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

