"""
Workflow management routes
"""
from flask import Blueprint, request, jsonify, g
from datetime import datetime
from src.models.user import db, Workflow
from src.middleware.auth import require_auth
from src.middleware.rate_limit import api_rate_limit

workflows_bp = Blueprint('workflows', __name__)

@workflows_bp.route('/workflows', methods=['GET'])
@require_auth
@api_rate_limit
def get_workflows():
    """Get user's workflows"""
    try:
        user = g.current_user
        workflows = Workflow.query.filter_by(user_id=user.id).order_by(Workflow.created_at.desc()).all()
        
        return jsonify({
            'workflows': [workflow.to_dict() for workflow in workflows]
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@workflows_bp.route('/workflows', methods=['POST'])
@require_auth
@api_rate_limit
def create_workflow():
    """Create a new workflow"""
    try:
        data = request.get_json()
        user = g.current_user
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({
                'error': 'Workflow name is required',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        name = data['name'].strip()
        description = data.get('description', '').strip()
        config = data.get('config', {})
        
        # Validate config is a dict
        if not isinstance(config, dict):
            return jsonify({
                'error': 'Config must be a valid JSON object',
                'code': 'VALIDATION_ERROR'
            }), 400
        
        # Create workflow
        workflow = Workflow(
            user_id=user.id,
            name=name,
            description=description,
            config=config
        )
        
        db.session.add(workflow)
        db.session.commit()
        
        return jsonify({
            'message': 'Workflow created successfully',
            'workflow': workflow.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@workflows_bp.route('/workflows/<int:workflow_id>', methods=['GET'])
@require_auth
@api_rate_limit
def get_workflow(workflow_id):
    """Get a specific workflow"""
    try:
        user = g.current_user
        workflow = Workflow.query.filter_by(id=workflow_id, user_id=user.id).first()
        
        if not workflow:
            return jsonify({
                'error': 'Workflow not found',
                'code': 'WORKFLOW_NOT_FOUND'
            }), 404
        
        return jsonify({
            'workflow': workflow.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@workflows_bp.route('/workflows/<int:workflow_id>', methods=['PUT'])
@require_auth
@api_rate_limit
def update_workflow(workflow_id):
    """Update a workflow"""
    try:
        data = request.get_json()
        user = g.current_user
        
        workflow = Workflow.query.filter_by(id=workflow_id, user_id=user.id).first()
        if not workflow:
            return jsonify({
                'error': 'Workflow not found',
                'code': 'WORKFLOW_NOT_FOUND'
            }), 404
        
        # Update fields if provided
        if 'name' in data:
            name = data['name'].strip()
            if not name:
                return jsonify({
                    'error': 'Workflow name cannot be empty',
                    'code': 'VALIDATION_ERROR'
                }), 400
            workflow.name = name
        
        if 'description' in data:
            workflow.description = data['description'].strip()
        
        if 'config' in data:
            config = data['config']
            if not isinstance(config, dict):
                return jsonify({
                    'error': 'Config must be a valid JSON object',
                    'code': 'VALIDATION_ERROR'
                }), 400
            workflow.config = config
        
        if 'is_active' in data:
            workflow.is_active = bool(data['is_active'])
        
        workflow.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Workflow updated successfully',
            'workflow': workflow.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@workflows_bp.route('/workflows/<int:workflow_id>', methods=['DELETE'])
@require_auth
@api_rate_limit
def delete_workflow(workflow_id):
    """Delete a workflow"""
    try:
        user = g.current_user
        workflow = Workflow.query.filter_by(id=workflow_id, user_id=user.id).first()
        
        if not workflow:
            return jsonify({
                'error': 'Workflow not found',
                'code': 'WORKFLOW_NOT_FOUND'
            }), 404
        
        db.session.delete(workflow)
        db.session.commit()
        
        return jsonify({
            'message': 'Workflow deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@workflows_bp.route('/workflows/<int:workflow_id>/execute', methods=['POST'])
@require_auth
@api_rate_limit
def execute_workflow(workflow_id):
    """Execute a workflow"""
    try:
        data = request.get_json()
        user = g.current_user
        
        workflow = Workflow.query.filter_by(id=workflow_id, user_id=user.id).first()
        if not workflow:
            return jsonify({
                'error': 'Workflow not found',
                'code': 'WORKFLOW_NOT_FOUND'
            }), 404
        
        if not workflow.is_active:
            return jsonify({
                'error': 'Workflow is not active',
                'code': 'WORKFLOW_INACTIVE'
            }), 400
        
        # Get input parameters
        input_params = data.get('params', {})
        
        # For now, return a placeholder execution result
        # In a real implementation, this would execute the actual workflow
        execution_result = {
            'workflow_id': workflow.id,
            'workflow_name': workflow.name,
            'input_params': input_params,
            'execution_id': f"exec_{workflow.id}_{int(datetime.utcnow().timestamp())}",
            'status': 'completed',
            'start_time': datetime.utcnow().isoformat(),
            'end_time': datetime.utcnow().isoformat(),
            'steps_executed': workflow.config.get('steps', []),
            'result': {
                'message': f"Workflow '{workflow.name}' executed successfully with parameters: {input_params}",
                'output': "This is a placeholder execution result. In a real implementation, this would contain the actual workflow output."
            }
        }
        
        return jsonify(execution_result), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@workflows_bp.route('/workflows/templates', methods=['GET'])
@require_auth
@api_rate_limit
def get_workflow_templates():
    """Get available workflow templates"""
    try:
        templates = [
            {
                'id': 'consciousness_assessment',
                'name': 'Consciousness Assessment',
                'description': 'Assess and guide consciousness development',
                'config': {
                    'steps': [
                        'Assess current consciousness level',
                        'Identify growth areas', 
                        'Provide personalized guidance',
                        'Create development plan'
                    ],
                    'model': 'gpt-4',
                    'temperature': 0.7,
                    'inputs': ['current_practices', 'goals', 'challenges']
                }
            },
            {
                'id': 'spiritual_guidance',
                'name': 'Spiritual Guidance Session',
                'description': 'Provide personalized spiritual guidance and wisdom',
                'config': {
                    'steps': [
                        'Listen to spiritual concerns',
                        'Analyze from multiple wisdom traditions',
                        'Provide guidance and insights',
                        'Suggest practices and next steps'
                    ],
                    'model': 'gpt-4',
                    'temperature': 0.8,
                    'inputs': ['question', 'background', 'tradition_preference']
                }
            },
            {
                'id': 'meditation_design',
                'name': 'Meditation Design',
                'description': 'Create personalized meditation practices',
                'config': {
                    'steps': [
                        'Assess meditation experience',
                        'Identify intention and goals',
                        'Design custom meditation',
                        'Provide guidance and tips'
                    ],
                    'model': 'gpt-4',
                    'temperature': 0.6,
                    'inputs': ['experience_level', 'time_available', 'intention']
                }
            },
            {
                'id': 'wisdom_integration',
                'name': 'Wisdom Integration',
                'description': 'Integrate insights from multiple wisdom traditions',
                'config': {
                    'steps': [
                        'Analyze question from multiple perspectives',
                        'Draw from various wisdom traditions',
                        'Synthesize unified guidance',
                        'Provide practical application'
                    ],
                    'model': 'gpt-4',
                    'temperature': 0.7,
                    'inputs': ['question', 'traditions', 'context']
                }
            }
        ]
        
        return jsonify({
            'templates': templates
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500

@workflows_bp.route('/workflows/templates/<template_id>', methods=['POST'])
@require_auth
@api_rate_limit
def create_from_template(template_id):
    """Create a workflow from a template"""
    try:
        data = request.get_json()
        user = g.current_user
        
        # Get template (in a real implementation, this would come from a database)
        templates = {
            'consciousness_assessment': {
                'name': 'Consciousness Assessment',
                'description': 'Assess and guide consciousness development',
                'config': {
                    'steps': [
                        'Assess current consciousness level',
                        'Identify growth areas',
                        'Provide personalized guidance', 
                        'Create development plan'
                    ],
                    'model': 'gpt-4',
                    'temperature': 0.7
                }
            },
            'spiritual_guidance': {
                'name': 'Spiritual Guidance Session',
                'description': 'Provide personalized spiritual guidance and wisdom',
                'config': {
                    'steps': [
                        'Listen to spiritual concerns',
                        'Analyze from multiple wisdom traditions',
                        'Provide guidance and insights',
                        'Suggest practices and next steps'
                    ],
                    'model': 'gpt-4',
                    'temperature': 0.8
                }
            }
        }
        
        template = templates.get(template_id)
        if not template:
            return jsonify({
                'error': 'Template not found',
                'code': 'TEMPLATE_NOT_FOUND'
            }), 404
        
        # Create workflow from template
        name = data.get('name', template['name'])
        description = data.get('description', template['description'])
        config = data.get('config', template['config'])
        
        workflow = Workflow(
            user_id=user.id,
            name=name,
            description=description,
            config=config
        )
        
        db.session.add(workflow)
        db.session.commit()
        
        return jsonify({
            'message': 'Workflow created from template successfully',
            'workflow': workflow.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Internal server error',
            'code': 'INTERNAL_ERROR'
        }), 500