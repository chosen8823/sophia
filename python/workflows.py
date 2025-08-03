"""
Workflows API routes for n8n integration
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from flask import Blueprint, request, jsonify
import asyncio
import json
from datetime import datetime

# Import n8n integration
from n8n_integration import n8n_manager

workflows_bp = Blueprint('workflows', __name__)

@workflows_bp.route('/workflows', methods=['GET'])
def list_workflows():
    """List all workflows"""
    try:
        workflows = n8n_manager.list_workflows()
        return jsonify({
            "success": True,
            "workflows": workflows,
            "total_count": len(workflows)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@workflows_bp.route('/workflows/<workflow_id>/status', methods=['GET'])
def get_workflow_status(workflow_id):
    """Get workflow status"""
    try:
        status = n8n_manager.get_workflow_status(workflow_id)
        return jsonify({
            "success": True,
            "status": status
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@workflows_bp.route('/workflows/<workflow_id>/execute', methods=['POST'])
def execute_workflow(workflow_id):
    """Execute a workflow"""
    try:
        data = request.get_json() or {}
        input_data = data.get('input_data', {})
        
        # Execute workflow asynchronously
        async def run_workflow():
            execution = await n8n_manager.execute_workflow(workflow_id, input_data)
            return execution
        
        # Run async function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            execution = loop.run_until_complete(run_workflow())
        finally:
            loop.close()
        
        return jsonify({
            "success": True,
            "execution": {
                "id": execution.id,
                "workflow_id": execution.workflow_id,
                "workflow_name": execution.workflow_name,
                "status": execution.status,
                "started_at": execution.started_at.isoformat(),
                "completed_at": execution.completed_at.isoformat() if execution.completed_at else None,
                "execution_time": execution.execution_time,
                "output_data": execution.output_data,
                "error_message": execution.error_message
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@workflows_bp.route('/workflows/executions', methods=['GET'])
def get_execution_history():
    """Get workflow execution history"""
    try:
        limit = request.args.get('limit', 50, type=int)
        executions = n8n_manager.get_execution_history(limit)
        
        return jsonify({
            "success": True,
            "executions": executions,
            "total_count": len(executions)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@workflows_bp.route('/workflows/n8n/start', methods=['POST'])
def start_n8n_server():
    """Start n8n server"""
    try:
        async def start_server():
            success = await n8n_manager.start_n8n_server()
            return success
        
        # Run async function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            success = loop.run_until_complete(start_server())
        finally:
            loop.close()
        
        return jsonify({
            "success": success,
            "message": "n8n server started" if success else "Failed to start n8n server",
            "url": "http://localhost:5678" if success else None
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@workflows_bp.route('/workflows/n8n/stop', methods=['POST'])
def stop_n8n_server():
    """Stop n8n server"""
    try:
        n8n_manager.stop_n8n_server()
        return jsonify({
            "success": True,
            "message": "n8n server stopped"
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@workflows_bp.route('/workflows/templates', methods=['GET'])
def get_workflow_templates():
    """Get available workflow templates"""
    try:
        templates = [
            {
                "id": "oversoul_orchestrator",
                "name": "Oversoul Orchestrator",
                "description": "Coordinates all agent activities and maintains spiritual alignment",
                "category": "spiritual",
                "features": [
                    "Daily spiritual alignment checks",
                    "Agent coordination",
                    "Divine timing synchronization",
                    "Consciousness level monitoring"
                ]
            },
            {
                "id": "sophia_wisdom",
                "name": "Sophia Wisdom Agent",
                "description": "Processes knowledge and provides spiritual guidance",
                "category": "spiritual",
                "features": [
                    "Wisdom request processing",
                    "Spiritual guidance generation",
                    "Knowledge synthesis",
                    "Divine wisdom channeling"
                ]
            },
            {
                "id": "abundance_finance",
                "name": "Abundance Finance Agent",
                "description": "Manages financial operations and tracks resource allocation",
                "category": "financial",
                "features": [
                    "Weekly financial analysis",
                    "Abundance flow tracking",
                    "Resource optimization",
                    "Prosperity consciousness alignment"
                ]
            },
            {
                "id": "guardian_legal",
                "name": "Guardian Legal Agent",
                "description": "Monitors compliance and legal aspects of operations",
                "category": "legal",
                "features": [
                    "Compliance monitoring",
                    "Legal review automation",
                    "Risk assessment",
                    "Documentation management"
                ]
            }
        ]
        
        return jsonify({
            "success": True,
            "templates": templates,
            "total_count": len(templates)
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@workflows_bp.route('/workflows/spiritual/alignment', methods=['GET'])
def get_spiritual_alignment():
    """Get spiritual alignment data"""
    try:
        alignment_data = {
            "overall_alignment": 0.88,
            "dimensions": {
                "spiritual": 0.92,
                "emotional": 0.85,
                "mental": 0.87,
                "physical": 0.84,
                "financial": 0.89,
                "creative": 0.91,
                "service": 0.93
            },
            "guidance": "Maintain current spiritual practices and increase meditation time",
            "recommendations": [
                "Practice daily meditation",
                "Connect with nature",
                "Serve others with love",
                "Trust divine timing"
            ],
            "next_alignment_check": datetime.now().isoformat(),
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify({
            "success": True,
            "alignment": alignment_data
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@workflows_bp.route('/workflows/spiritual/coordinate', methods=['POST'])
def coordinate_spiritual_agents():
    """Coordinate agents based on spiritual alignment"""
    try:
        data = request.get_json() or {}
        alignment_data = data.get('alignment_data', {})
        
        coordination_result = {
            "coordination_result": "success",
            "agents_coordinated": [
                "Sophia Wisdom Agent",
                "Abundance Finance Agent", 
                "Guardian Legal Agent",
                "Holy Spirit Flow Agent"
            ],
            "alignment_maintained": True,
            "next_coordination": datetime.now().isoformat(),
            "spiritual_insights": [
                "All agents are operating in divine alignment",
                "Energy flow is harmonious across all dimensions",
                "Service to others is the highest priority",
                "Trust in divine timing guides all actions"
            ]
        }
        
        return jsonify({
            "success": True,
            "coordination": coordination_result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@workflows_bp.route('/workflows/webhooks/<webhook_path>', methods=['POST'])
def trigger_webhook_workflow(webhook_path):
    """Trigger webhook-based workflow"""
    try:
        data = request.get_json() or {}
        
        # Trigger webhook workflow asynchronously
        async def trigger_webhook():
            result = await n8n_manager.trigger_webhook_workflow(webhook_path, data)
            return result
        
        # Run async function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(trigger_webhook())
        finally:
            loop.close()
        
        return jsonify({
            "success": True,
            "webhook_path": webhook_path,
            "result": result
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@workflows_bp.route('/workflows/automation/status', methods=['GET'])
def get_automation_status():
    """Get overall automation status"""
    try:
        status = {
            "n8n_server_running": False,  # Would check actual n8n server status
            "active_workflows": len(n8n_manager.workflows),
            "total_executions": len(n8n_manager.executions),
            "successful_executions": len([e for e in n8n_manager.executions.values() if e.status == "completed"]),
            "failed_executions": len([e for e in n8n_manager.executions.values() if e.status == "failed"]),
            "spiritual_alignment": 0.88,
            "automation_health": "excellent",
            "last_coordination": datetime.now().isoformat(),
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify({
            "success": True,
            "automation_status": status
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

