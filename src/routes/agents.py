"""
Agents API routes for the Manus platform
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from flask import Blueprint, request, jsonify
import asyncio
import json
from datetime import datetime

# Import our agent modules
try:
    from advanced_agent import create_ultimate_agent, AdvancedAgent
    from agent_sdk import sdk, create_agent, get_agent, send_message, get_system_status
except ImportError as e:
    print(f"Warning: Agent modules not available: {e}")
    # Create mock functions
    def create_ultimate_agent(*args, **kwargs): return None
    def create_agent(*args, **kwargs): return None
    def get_agent(*args, **kwargs): return None
    def send_message(*args, **kwargs): return "Mock response"
    def get_system_status(): return {"status": "mock"}

agents_bp = Blueprint('agents', __name__)

# Global agent instances
active_agents = {}

@agents_bp.route('/agents', methods=['GET'])
def list_agents():
    """List all active agents"""
    try:
        agents_list = []
        for agent_id, agent in active_agents.items():
            if hasattr(agent, 'get_advanced_status'):
                status = agent.get_advanced_status()
            else:
                status = agent.get_status()
            agents_list.append(status)
        
        return jsonify({
            "success": True,
            "agents": agents_list,
            "total_count": len(agents_list)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@agents_bp.route('/agents', methods=['POST'])
def create_new_agent():
    """Create a new agent"""
    try:
        data = request.get_json()
        agent_type = data.get('type', 'advanced')
        name = data.get('name', 'New Agent')
        llm_provider = data.get('llm_provider', 'huggingface')
        
        if agent_type == 'ultimate' or agent_type == 'advanced':
            agent = create_ultimate_agent(name=name, llm_provider=llm_provider)
        else:
            agent = create_agent(
                agent_type=agent_type,
                name=name,
                description=data.get('description', 'AI Agent'),
                capabilities=data.get('capabilities', [])
            )
        
        active_agents[agent.id] = agent
        
        if hasattr(agent, 'get_advanced_status'):
            status = agent.get_advanced_status()
        else:
            status = agent.get_status()
        
        return jsonify({
            "success": True,
            "agent": status,
            "message": f"Agent '{name}' created successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@agents_bp.route('/agents/<agent_id>', methods=['GET'])
def get_agent_details(agent_id):
    """Get agent details"""
    try:
        agent = active_agents.get(agent_id)
        if not agent:
            return jsonify({"success": False, "error": "Agent not found"}), 404
        
        if hasattr(agent, 'get_advanced_status'):
            status = agent.get_advanced_status()
        else:
            status = agent.get_status()
        
        return jsonify({
            "success": True,
            "agent": status
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@agents_bp.route('/agents/<agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    """Delete an agent"""
    try:
        if agent_id in active_agents:
            agent_name = active_agents[agent_id].name
            del active_agents[agent_id]
            return jsonify({
                "success": True,
                "message": f"Agent '{agent_name}' deleted successfully"
            })
        else:
            return jsonify({"success": False, "error": "Agent not found"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@agents_bp.route('/agents/<agent_id>/chat', methods=['POST'])
def chat_with_agent(agent_id):
    """Send message to specific agent"""
    try:
        agent = active_agents.get(agent_id)
        if not agent:
            return jsonify({"success": False, "error": "Agent not found"}), 404
        
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({"success": False, "error": "Message is required"}), 400
        
        # Process message asynchronously
        async def process_message():
            response = await agent.process_message(message)
            return response
        
        # Run async function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            response = loop.run_until_complete(process_message())
        finally:
            loop.close()
        
        return jsonify({
            "success": True,
            "response": {
                "id": response.id,
                "content": response.content,
                "role": response.role,
                "timestamp": response.timestamp.isoformat(),
                "metadata": response.metadata
            },
            "agent_name": agent.name
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@agents_bp.route('/agents/sophia/create', methods=['POST'])
def create_sophia_agent():
    """Create Sophia Wisdom Agent"""
    try:
        data = request.get_json() or {}
        llm_provider = data.get('llm_provider', 'huggingface')
        
        sophia = create_agent("sophia", llm_client=None)
        active_agents[sophia.id] = sophia
        
        return jsonify({
            "success": True,
            "agent": sophia.get_status(),
            "message": "Sophia Wisdom Agent created successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@agents_bp.route('/agents/ultimate/create', methods=['POST'])
def create_ultimate_ai_agent():
    """Create Ultimate AI Agent"""
    try:
        data = request.get_json() or {}
        name = data.get('name', 'Ultimate AI Agent')
        llm_provider = data.get('llm_provider', 'huggingface')
        
        ultimate = create_ultimate_agent(name=name, llm_provider=llm_provider)
        active_agents[ultimate.id] = ultimate
        
        return jsonify({
            "success": True,
            "agent": ultimate.get_advanced_status(),
            "message": f"Ultimate AI Agent '{name}' created successfully"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@agents_bp.route('/agents/system/status', methods=['GET'])
def get_system_status_endpoint():
    """Get overall system status"""
    try:
        # Get SDK system status
        sdk_status = get_system_status()
        
        # Add our active agents info
        system_status = {
            "platform": "Manus Clone Platform",
            "active_agents": len(active_agents),
            "agent_types": {},
            "total_interactions": 0,
            "successful_tasks": 0,
            "failed_tasks": 0,
            "sdk_status": sdk_status,
            "timestamp": datetime.now().isoformat()
        }
        
        # Analyze active agents
        for agent in active_agents.values():
            agent_type = type(agent).__name__
            if agent_type not in system_status["agent_types"]:
                system_status["agent_types"][agent_type] = 0
            system_status["agent_types"][agent_type] += 1
            
            system_status["total_interactions"] += agent.total_interactions
            system_status["successful_tasks"] += agent.successful_tasks
            system_status["failed_tasks"] += agent.failed_tasks
        
        return jsonify({
            "success": True,
            "system_status": system_status
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@agents_bp.route('/agents/capabilities', methods=['GET'])
def get_available_capabilities():
    """Get list of available agent capabilities"""
    try:
        from agent_sdk import AgentCapability
        from advanced_agent import AdvancedCapability
        
        basic_capabilities = [cap.value for cap in AgentCapability]
        advanced_capabilities = [cap.value for cap in AdvancedCapability]
        
        return jsonify({
            "success": True,
            "capabilities": {
                "basic": basic_capabilities,
                "advanced": advanced_capabilities,
                "all": basic_capabilities + advanced_capabilities
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@agents_bp.route('/agents/templates', methods=['GET'])
def get_agent_templates():
    """Get available agent templates"""
    try:
        templates = [
            {
                "id": "sophia",
                "name": "Sophia Wisdom Agent",
                "description": "Advanced AI agent with spiritual wisdom and emotional intelligence",
                "capabilities": [
                    "chat", "spiritual_guidance", "emotional_intelligence", 
                    "memory_management", "planning", "decision_making"
                ],
                "special_features": [
                    "Divine guidance channeling",
                    "Emotional healing support", 
                    "Wisdom synthesis",
                    "Spiritual alignment assessment"
                ]
            },
            {
                "id": "ultimate",
                "name": "Ultimate AI Agent",
                "description": "The most advanced AI agent with comprehensive capabilities",
                "capabilities": [
                    "chat", "search", "code_execution", "file_operations",
                    "image_analysis", "data_analysis", "creative_writing",
                    "planning", "spiritual_guidance", "emotional_intelligence",
                    "deep_reasoning", "creative_synthesis", "multi_modal_processing"
                ],
                "special_features": [
                    "Multi-dimensional awareness",
                    "Consciousness simulation",
                    "Quantum intuition",
                    "Divine channeling",
                    "Advanced learning",
                    "Strategic planning"
                ]
            },
            {
                "id": "base",
                "name": "Base Agent",
                "description": "Basic AI agent with core functionality",
                "capabilities": ["chat"],
                "special_features": ["Simple conversation"]
            }
        ]
        
        return jsonify({
            "success": True,
            "templates": templates
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

