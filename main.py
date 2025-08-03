#!/usr/bin/env python3
"""
Sophia AI Platform - Simplified Main Entry Point
This provides a basic working interface without heavy dependencies
"""
import os
import sys
import json
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SophiaHTTPHandler(http.server.BaseHTTPRequestHandler):
    """Simple HTTP handler for the Sophia platform"""
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/':
            self.send_json_response({
                "message": "Welcome to Sophia AI Platform",
                "version": "1.0.0",
                "status": "healthy",
                "endpoints": {
                    "health": "/health",
                    "platform_info": "/api/platform/info", 
                    "agents": "/api/agents/",
                }
            })
        elif path == '/health':
            self.send_json_response({
                "status": "healthy",
                "platform": "Sophia AI Platform",
                "version": "1.0.0",
                "components": {
                    "basic_server": "operational",
                    "file_system": "operational"
                }
            })
        elif path == '/api/platform/info':
            self.send_json_response({
                "name": "Sophia AI Platform",
                "description": "Consolidated AI platform (Basic Mode)",
                "version": "1.0.0",
                "mode": "basic",
                "features": [
                    "Basic HTTP API",
                    "Health monitoring",
                    "Platform information",
                    "Extensible architecture"
                ],
                "note": "This is a simplified version. Install full dependencies for advanced features."
            })
        elif path == '/api/agents/':
            self.send_json_response({
                "agents": [
                    {
                        "id": "basic_agent",
                        "name": "Basic Agent",
                        "description": "Simple agent for basic operations",
                        "status": "available",
                        "note": "Advanced agents require full dependency installation"
                    }
                ]
            })
        else:
            self.send_error(404, "Endpoint not found")
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/agents/basic/execute':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                request_data = json.loads(post_data.decode('utf-8'))
                
                self.send_json_response({
                    "agent_id": "basic_agent",
                    "task": request_data.get("task", ""),
                    "status": "executed",
                    "result": f"Basic agent received task: {request_data.get('task', 'No task specified')}"
                })
            except Exception as e:
                self.send_error(500, f"Error processing request: {str(e)}")
        else:
            self.send_error(404, "Endpoint not found")
    
    def send_json_response(self, data, status_code=200):
        """Send a JSON response"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        json_data = json.dumps(data, indent=2)
        self.wfile.write(json_data.encode('utf-8'))
    
    def log_message(self, format, *args):
        """Custom log message format"""
        logger.info(f"{self.address_string()} - {format % args}")

def run_server(port=8000, host='0.0.0.0'):
    """Run the Sophia platform server"""
    try:
        with socketserver.TCPServer((host, port), SophiaHTTPHandler) as httpd:
            logger.info(f"Sophia AI Platform starting on {host}:{port}")
            logger.info(f"Visit http://{host}:{port} to access the platform")
            logger.info("Press Ctrl+C to stop the server")
            httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    print("=" * 60)
    print("SOPHIA AI PLATFORM - STARTING")
    print("=" * 60)
    print(f"Mode: Basic (simplified without heavy dependencies)")
    print(f"Host: {host}")
    print(f"Port: {port}")
    print(f"To install full features, run: pip install -r requirements.txt")
    print("=" * 60)
    
    run_server(port, host)

