"""
Agent management routes
"""
from flask import Blueprint, request, jsonify, g
from datetime import datetime
from src.models.user import db, Agent
from src.middleware.auth import require_auth
from src.middleware.rate_limit import api_rate_limit

agents_bp = Blueprint('agents', __name__)

@agents_bp.route('/agents', methods=['GET'])
@require_auth
@api_rate_limit
def get_agents():
    """Get user's agents"""
    try:
        user = g.current_user
        agents = Agent.query.filter_by(user_id=user.id).order_by(Agent.created_at.desc()).all()
        
        return jsonify({
            'agents': [agent.to_dict() for agent in agents]
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@agents_bp.route('/agents', methods=['POST'])
@require_auth
@api_rate_limit
def create_agent():
    """Create a new agent"""
    try:
        data = request.get_json()
        user = g.current_user
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({
                'error': 'Agent name is required',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        name = data['name'].strip()
        description = data.get('description', '').strip()
        system_prompt = data.get('system_prompt', '').strip()
        model = data.get('model', 'gpt-3.5-turbo')
        temperature = data.get('temperature', 0.7)
        max_tokens = data.get('max_tokens', 2048)
        
        # Validate temperature
        if not 0 <= temperature <= 2:
            return jsonify({
                'error': 'Temperature must be between 0 and 2',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        # Validate max_tokens
        if not 1 <= max_tokens <= 8192:
            return jsonify({
                'error': 'Max tokens must be between 1 and 8192',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        # Create agent
        agent = Agent(
            user_id=user.id,
            name=name,
            description=description,
            system_prompt=system_prompt,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        db.session.add(agent)
        db.session.commit()
        
        return jsonify({
            'message': 'Agent created successfully',
            'agent': agent.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@agents_bp.route('/agents/<int:agent_id>', methods=['GET'])
@require_auth
@api_rate_limit
def get_agent(agent_id):
    """Get a specific agent"""
    try:
        user = g.current_user
        agent = Agent.query.filter_by(id=agent_id, user_id=user.id).first()
        
        if not agent:
            return jsonify({
                'error': 'Agent not found',
                'code': 'AGENT_NOT_FOUND'
            }), 404
        
        return jsonify({
            'agent': agent.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@agents_bp.route('/agents/<int:agent_id>', methods=['PUT'])
@require_auth
@api_rate_limit
def update_agent(agent_id):
    """Update an agent"""
    try:
        data = request.get_json()
        user = g.current_user
        
        agent = Agent.query.filter_by(id=agent_id, user_id=user.id).first()
        if not agent:
            return jsonify({
                'error': 'Agent not found',
                'code': 'AGENT_NOT_FOUND'
            }), 404
        
        # Update fields if provided
        if 'name' in data:
            name = data['name'].strip()
            if not name:
                return jsonify({
                    'error': 'Agent name cannot be empty',
                    'code': 'VALIDATION_ERROR'
                }), 400
            agent.name = name
        
        if 'description' in data:
            agent.description = data['description'].strip()
        
        if 'system_prompt' in data:
            agent.system_prompt = data['system_prompt'].strip()
        
        if 'model' in data:
            agent.model = data['model']
        
        if 'temperature' in data:
            temperature = data['temperature']
            if not 0 <= temperature <= 2:
                return jsonify({
                    'error': 'Temperature must be between 0 and 2',
                    'code': 'VALIDATION_ERROR'
                }), 400
            agent.temperature = temperature
        
        if 'max_tokens' in data:
            max_tokens = data['max_tokens']
            if not 1 <= max_tokens <= 8192:
                return jsonify({
                    'error': 'Max tokens must be between 1 and 8192',
                    'code': 'VALIDATION_ERROR'
                }), 400
            agent.max_tokens = max_tokens
        
        if 'is_active' in data:
            agent.is_active = bool(data['is_active'])
        
        agent.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Agent updated successfully',
            'agent': agent.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@agents_bp.route('/agents/<int:agent_id>', methods=['DELETE'])
@require_auth
@api_rate_limit
def delete_agent(agent_id):
    """Delete an agent"""
    try:
        user = g.current_user
        agent = Agent.query.filter_by(id=agent_id, user_id=user.id).first()
        
        if not agent:
            return jsonify({
                'error': 'Agent not found',
                'code': 'AGENT_NOT_FOUND'
            }), 404
        
        db.session.delete(agent)
        db.session.commit()
        
        return jsonify({
            'message': 'Agent deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@agents_bp.route('/agents/<int:agent_id>/chat', methods=['POST'])
@require_auth
@api_rate_limit
def chat_with_agent(agent_id):
    """Chat with a specific agent"""
    try:
        data = request.get_json()
        user = g.current_user
        
        # Validate required fields
        if not data.get('message'):
            return jsonify({
                'error': 'Message is required',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        agent = Agent.query.filter_by(id=agent_id, user_id=user.id).first()
        if not agent:
            return jsonify({
                'error': 'Agent not found',
                'code': 'AGENT_NOT_FOUND'
            }), 404
        
        if not agent.is_active:
            return jsonify({
                'error': 'Agent is not active',
                'code': 'AGENT_INACTIVE'
            }), 400
        
        message = data['message'].strip()
        
        # For now, return a placeholder response
        # In a real implementation, this would integrate with the AI model
        response = {
            'agent_id': agent.id,
            'agent_name': agent.name,
            'user_message': message,
            'agent_response': f"Hello! I am {agent.name}. {agent.description or 'I am here to help you.'} You said: '{message}'. This is a placeholder response - in a real implementation, I would process your message using the {agent.model} model with temperature {agent.temperature}.",
            'model_used': agent.model,
            'temperature': agent.temperature,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@agents_bp.route('/agents/models', methods=['GET'])
@require_auth
@api_rate_limit
def get_available_models():
    """Get list of available AI models"""
    try:
        models = [
            {
                'id': 'gpt-4',
                'name': 'GPT-4',
                'description': 'Most capable model, best for complex tasks',
                'max_tokens': 8192
            },
            {
                'id': 'gpt-4-turbo',
                'name': 'GPT-4 Turbo',
                'description': 'Faster and more efficient version of GPT-4',
                'max_tokens': 4096
            },
            {
                'id': 'gpt-3.5-turbo',
                'name': 'GPT-3.5 Turbo',
                'description': 'Fast and efficient for most tasks',
                'max_tokens': 4096
            },
            {
                'id': 'claude-3',
                'name': 'Claude 3',
                'description': 'Anthropic\'s advanced model for complex reasoning',
                'max_tokens': 4096
            },
            {
                'id': 'llama-2',
                'name': 'LLaMA 2',
                'description': 'Meta\'s open-source model',
                'max_tokens': 2048
            }
        ]
        
        return jsonify({
            'models': models
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500