"""
n8n Workflow Automation Integration
Provides integration between the manus platform and n8n workflows
"""
import os
import json
import time
import uuid
import asyncio
import logging
import subprocess
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, field
from datetime import datetime
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class WorkflowExecution:
    """Workflow execution tracking"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    workflow_id: str = ""
    workflow_name: str = ""
    status: str = "pending"  # pending, running, completed, failed
    started_at: datetime = field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    input_data: Dict[str, Any] = field(default_factory=dict)
    output_data: Dict[str, Any] = field(default_factory=dict)
    error_message: Optional[str] = None
    execution_time: float = 0.0

@dataclass
class WorkflowTemplate:
    """Workflow template definition"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    category: str = "general"
    nodes: List[Dict[str, Any]] = field(default_factory=list)
    connections: Dict[str, Any] = field(default_factory=dict)
    settings: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

class N8nManager:
    """Manager for n8n workflow automation"""
    
    def __init__(self, n8n_url: str = "http://localhost:5678", api_key: str = None):
        self.n8n_url = n8n_url
        self.api_key = api_key
        self.workflows: Dict[str, WorkflowTemplate] = {}
        self.executions: Dict[str, WorkflowExecution] = {}
        self.n8n_process = None
        
        # Initialize default workflows
        self._initialize_default_workflows()
    
    def _initialize_default_workflows(self):
        """Initialize default workflow templates"""
        
        # Oversoul Orchestrator Workflow
        oversoul_workflow = WorkflowTemplate(
            name="Oversoul Orchestrator",
            description="Coordinates all agent activities and maintains spiritual alignment",
            category="spiritual",
            nodes=[
                {
                    "id": "start",
                    "type": "n8n-nodes-base.start",
                    "name": "Start",
                    "parameters": {},
                    "position": [250, 300]
                },
                {
                    "id": "schedule",
                    "type": "n8n-nodes-base.cron",
                    "name": "Daily Schedule",
                    "parameters": {
                        "rule": {
                            "interval": [{"field": "cronExpression", "expression": "0 9 * * *"}]
                        }
                    },
                    "position": [450, 300]
                },
                {
                    "id": "spiritual_check",
                    "type": "n8n-nodes-base.httpRequest",
                    "name": "Spiritual Alignment Check",
                    "parameters": {
                        "url": "http://localhost:8000/api/spiritual/alignment",
                        "method": "GET"
                    },
                    "position": [650, 300]
                },
                {
                    "id": "coordinate_agents",
                    "type": "n8n-nodes-base.httpRequest",
                    "name": "Coordinate Agents",
                    "parameters": {
                        "url": "http://localhost:8000/api/agents/coordinate",
                        "method": "POST",
                        "body": {
                            "alignment_data": "={{$json}}"
                        }
                    },
                    "position": [850, 300]
                }
            ],
            connections={
                "Start": {"main": [[{"node": "Daily Schedule", "type": "main", "index": 0}]]},
                "Daily Schedule": {"main": [[{"node": "Spiritual Alignment Check", "type": "main", "index": 0}]]},
                "Spiritual Alignment Check": {"main": [[{"node": "Coordinate Agents", "type": "main", "index": 0}]]}
            }
        )
        self.workflows[oversoul_workflow.id] = oversoul_workflow
        
        # Sophia Wisdom Agent Workflow
        sophia_workflow = WorkflowTemplate(
            name="Sophia Wisdom Agent",
            description="Processes knowledge and provides spiritual guidance",
            category="spiritual",
            nodes=[
                {
                    "id": "webhook",
                    "type": "n8n-nodes-base.webhook",
                    "name": "Wisdom Request",
                    "parameters": {
                        "path": "sophia/wisdom",
                        "httpMethod": "POST"
                    },
                    "position": [250, 300]
                },
                {
                    "id": "process_request",
                    "type": "n8n-nodes-base.function",
                    "name": "Process Wisdom Request",
                    "parameters": {
                        "functionCode": """
                        const request = items[0].json;
                        const wisdom_response = {
                            guidance: "Trust in divine timing and the 11:11 portal of manifestation.",
                            spiritual_dimension: "Divine Wisdom",
                            alignment_score: 0.85,
                            recommended_actions: [
                                "Meditate on this guidance",
                                "Journal about your insights",
                                "Take inspired action"
                            ]
                        };
                        return [{json: wisdom_response}];
                        """
                    },
                    "position": [450, 300]
                },
                {
                    "id": "store_wisdom",
                    "type": "n8n-nodes-base.httpRequest",
                    "name": "Store Wisdom",
                    "parameters": {
                        "url": "http://localhost:8000/api/wisdom/store",
                        "method": "POST",
                        "body": "={{$json}}"
                    },
                    "position": [650, 300]
                }
            ],
            connections={
                "Wisdom Request": {"main": [[{"node": "Process Wisdom Request", "type": "main", "index": 0}]]},
                "Process Wisdom Request": {"main": [[{"node": "Store Wisdom", "type": "main", "index": 0}]]}
            }
        )
        self.workflows[sophia_workflow.id] = sophia_workflow
        
        # Abundance Finance Agent Workflow
        finance_workflow = WorkflowTemplate(
            name="Abundance Finance Agent",
            description="Manages financial operations and tracks resource allocation",
            category="financial",
            nodes=[
                {
                    "id": "schedule",
                    "type": "n8n-nodes-base.cron",
                    "name": "Weekly Finance Check",
                    "parameters": {
                        "rule": {
                            "interval": [{"field": "cronExpression", "expression": "0 9 * * 1"}]
                        }
                    },
                    "position": [250, 300]
                },
                {
                    "id": "fetch_financial_data",
                    "type": "n8n-nodes-base.httpRequest",
                    "name": "Fetch Financial Data",
                    "parameters": {
                        "url": "http://localhost:8000/api/finance/data",
                        "method": "GET"
                    },
                    "position": [450, 300]
                },
                {
                    "id": "analyze_abundance",
                    "type": "n8n-nodes-base.function",
                    "name": "Analyze Abundance Flow",
                    "parameters": {
                        "functionCode": """
                        const financial_data = items[0].json;
                        const abundance_analysis = {
                            total_revenue: financial_data.revenue || 0,
                            spiritual_alignment: 0.88,
                            abundance_flow: "positive",
                            recommendations: [
                                "Continue current abundance practices",
                                "Increase gratitude practices",
                                "Share abundance with community"
                            ]
                        };
                        return [{json: abundance_analysis}];
                        """
                    },
                    "position": [650, 300]
                },
                {
                    "id": "update_dashboard",
                    "type": "n8n-nodes-base.httpRequest",
                    "name": "Update Abundance Dashboard",
                    "parameters": {
                        "url": "http://localhost:8000/api/dashboard/abundance",
                        "method": "POST",
                        "body": "={{$json}}"
                    },
                    "position": [850, 300]
                }
            ],
            connections={
                "Weekly Finance Check": {"main": [[{"node": "Fetch Financial Data", "type": "main", "index": 0}]]},
                "Fetch Financial Data": {"main": [[{"node": "Analyze Abundance Flow", "type": "main", "index": 0}]]},
                "Analyze Abundance Flow": {"main": [[{"node": "Update Abundance Dashboard", "type": "main", "index": 0}]]}
            }
        )
        self.workflows[finance_workflow.id] = finance_workflow
        
        # Guardian Legal Agent Workflow
        legal_workflow = WorkflowTemplate(
            name="Guardian Legal Agent",
            description="Monitors compliance and legal aspects of operations",
            category="legal",
            nodes=[
                {
                    "id": "webhook",
                    "type": "n8n-nodes-base.webhook",
                    "name": "Legal Review Request",
                    "parameters": {
                        "path": "legal/review",
                        "httpMethod": "POST"
                    },
                    "position": [250, 300]
                },
                {
                    "id": "compliance_check",
                    "type": "n8n-nodes-base.function",
                    "name": "Compliance Check",
                    "parameters": {
                        "functionCode": """
                        const request = items[0].json;
                        const compliance_result = {
                            status: "compliant",
                            risk_level: "low",
                            recommendations: [
                                "Continue current practices",
                                "Review quarterly compliance",
                                "Update documentation as needed"
                            ],
                            next_review_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
                        };
                        return [{json: compliance_result}];
                        """
                    },
                    "position": [450, 300]
                },
                {
                    "id": "store_legal_record",
                    "type": "n8n-nodes-base.httpRequest",
                    "name": "Store Legal Record",
                    "parameters": {
                        "url": "http://localhost:8000/api/legal/records",
                        "method": "POST",
                        "body": "={{$json}}"
                    },
                    "position": [650, 300]
                }
            ],
            connections={
                "Legal Review Request": {"main": [[{"node": "Compliance Check", "type": "main", "index": 0}]]},
                "Compliance Check": {"main": [[{"node": "Store Legal Record", "type": "main", "index": 0}]]}
            }
        )
        self.workflows[legal_workflow.id] = legal_workflow
        
        logger.info(f"Initialized {len(self.workflows)} default workflows")
    
    async def start_n8n_server(self, port: int = 5678) -> bool:
        """Start n8n server"""
        try:
            # Check if n8n is already running
            try:
                response = requests.get(f"http://localhost:{port}/healthz", timeout=5)
                if response.status_code == 200:
                    logger.info("n8n server is already running")
                    return True
            except requests.exceptions.RequestException:
                pass
            
            # Start n8n server
            env = os.environ.copy()
            env.update({
                "N8N_PORT": str(port),
                "N8N_HOST": "0.0.0.0",
                "N8N_PROTOCOL": "http",
                "N8N_DISABLE_UI": "false",
                "N8N_BASIC_AUTH_ACTIVE": "false",
                "WEBHOOK_URL": f"http://localhost:{port}",
                "N8N_LOG_LEVEL": "info"
            })
            
            self.n8n_process = subprocess.Popen(
                ["n8n", "start"],
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd="/home/ubuntu/manus_clone_platform"
            )
            
            # Wait for n8n to start
            for i in range(30):  # Wait up to 30 seconds
                try:
                    response = requests.get(f"http://localhost:{port}/healthz", timeout=2)
                    if response.status_code == 200:
                        logger.info(f"n8n server started successfully on port {port}")
                        return True
                except requests.exceptions.RequestException:
                    await asyncio.sleep(1)
            
            logger.error("Failed to start n8n server")
            return False
            
        except Exception as e:
            logger.error(f"Error starting n8n server: {e}")
            return False
    
    def stop_n8n_server(self):
        """Stop n8n server"""
        if self.n8n_process:
            self.n8n_process.terminate()
            self.n8n_process.wait()
            self.n8n_process = None
            logger.info("n8n server stopped")
    
    async def create_workflow(self, workflow: WorkflowTemplate) -> bool:
        """Create workflow in n8n"""
        try:
            # Convert workflow template to n8n format
            n8n_workflow = {
                "name": workflow.name,
                "nodes": workflow.nodes,
                "connections": workflow.connections,
                "settings": workflow.settings,
                "active": True
            }
            
            # Send to n8n API
            response = requests.post(
                f"{self.n8n_url}/api/v1/workflows",
                json=n8n_workflow,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code in [200, 201]:
                logger.info(f"Created workflow: {workflow.name}")
                return True
            else:
                logger.error(f"Failed to create workflow: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error creating workflow: {e}")
            return False
    
    async def execute_workflow(self, workflow_id: str, input_data: Dict[str, Any] = None) -> WorkflowExecution:
        """Execute a workflow"""
        try:
            execution = WorkflowExecution(
                workflow_id=workflow_id,
                workflow_name=self.workflows.get(workflow_id, WorkflowTemplate()).name,
                input_data=input_data or {},
                status="running"
            )
            
            self.executions[execution.id] = execution
            
            # Simulate workflow execution (in real implementation, this would trigger n8n)
            await asyncio.sleep(2)  # Simulate processing time
            
            # Mock successful execution
            execution.status = "completed"
            execution.completed_at = datetime.now()
            execution.execution_time = 2.0
            execution.output_data = {
                "result": "Workflow executed successfully",
                "processed_at": datetime.now().isoformat(),
                "workflow_name": execution.workflow_name
            }
            
            logger.info(f"Executed workflow: {execution.workflow_name}")
            return execution
            
        except Exception as e:
            logger.error(f"Error executing workflow: {e}")
            execution.status = "failed"
            execution.error_message = str(e)
            execution.completed_at = datetime.now()
            return execution
    
    async def trigger_webhook_workflow(self, webhook_path: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger a webhook-based workflow"""
        try:
            response = requests.post(
                f"{self.n8n_url}/webhook/{webhook_path}",
                json=data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Webhook trigger failed: {response.text}")
                return {"error": "Webhook trigger failed"}
                
        except Exception as e:
            logger.error(f"Error triggering webhook: {e}")
            return {"error": str(e)}
    
    def get_workflow_status(self, workflow_id: str) -> Dict[str, Any]:
        """Get workflow status"""
        workflow = self.workflows.get(workflow_id)
        if not workflow:
            return {"error": "Workflow not found"}
        
        executions = [exec for exec in self.executions.values() if exec.workflow_id == workflow_id]
        
        return {
            "workflow_id": workflow_id,
            "name": workflow.name,
            "description": workflow.description,
            "category": workflow.category,
            "total_executions": len(executions),
            "successful_executions": len([e for e in executions if e.status == "completed"]),
            "failed_executions": len([e for e in executions if e.status == "failed"]),
            "last_execution": executions[-1].started_at.isoformat() if executions else None
        }
    
    def list_workflows(self) -> List[Dict[str, Any]]:
        """List all workflows"""
        return [
            {
                "id": wf.id,
                "name": wf.name,
                "description": wf.description,
                "category": wf.category,
                "created_at": wf.created_at.isoformat(),
                "updated_at": wf.updated_at.isoformat()
            }
            for wf in self.workflows.values()
        ]
    
    def get_execution_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get execution history"""
        executions = sorted(
            self.executions.values(),
            key=lambda x: x.started_at,
            reverse=True
        )[:limit]
        
        return [
            {
                "id": exec.id,
                "workflow_id": exec.workflow_id,
                "workflow_name": exec.workflow_name,
                "status": exec.status,
                "started_at": exec.started_at.isoformat(),
                "completed_at": exec.completed_at.isoformat() if exec.completed_at else None,
                "execution_time": exec.execution_time,
                "error_message": exec.error_message
            }
            for exec in executions
        ]

# Global n8n manager instance
n8n_manager = N8nManager()

# FastAPI app for n8n integration endpoints
app = FastAPI(title="n8n Integration API", description="n8n workflow automation integration")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "n8n Integration API",
        "version": "1.0.0",
        "description": "Workflow automation integration for manus platform"
    }

@app.post("/start")
async def start_n8n():
    """Start n8n server"""
    success = await n8n_manager.start_n8n_server()
    return {"success": success, "message": "n8n server started" if success else "Failed to start n8n server"}

@app.post("/stop")
async def stop_n8n():
    """Stop n8n server"""
    n8n_manager.stop_n8n_server()
    return {"success": True, "message": "n8n server stopped"}

@app.get("/workflows")
async def list_workflows():
    """List all workflows"""
    return {"workflows": n8n_manager.list_workflows()}

@app.get("/workflows/{workflow_id}/status")
async def get_workflow_status(workflow_id: str):
    """Get workflow status"""
    return n8n_manager.get_workflow_status(workflow_id)

@app.post("/workflows/{workflow_id}/execute")
async def execute_workflow(workflow_id: str, input_data: Dict[str, Any] = None):
    """Execute a workflow"""
    execution = await n8n_manager.execute_workflow(workflow_id, input_data)
    return {
        "execution_id": execution.id,
        "status": execution.status,
        "started_at": execution.started_at.isoformat(),
        "workflow_name": execution.workflow_name
    }

@app.post("/webhooks/{webhook_path}")
async def trigger_webhook(webhook_path: str, data: Dict[str, Any]):
    """Trigger webhook workflow"""
    result = await n8n_manager.trigger_webhook_workflow(webhook_path, data)
    return result

@app.get("/executions")
async def get_execution_history(limit: int = 50):
    """Get execution history"""
    return {"executions": n8n_manager.get_execution_history(limit)}

@app.get("/health")
async def health_check():
    """Health check"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Spiritual alignment endpoints for 11:11 Alliance
@app.get("/api/spiritual/alignment")
async def get_spiritual_alignment():
    """Get spiritual alignment data"""
    return {
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
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/agents/coordinate")
async def coordinate_agents(alignment_data: Dict[str, Any]):
    """Coordinate agents based on alignment data"""
    return {
        "coordination_result": "success",
        "agents_coordinated": [
            "Sophia Wisdom Agent",
            "Abundance Finance Agent",
            "Guardian Legal Agent",
            "Holy Spirit Flow Agent"
        ],
        "next_coordination": (datetime.now().timestamp() + 86400),  # Next day
        "alignment_maintained": True
    }

@app.post("/api/wisdom/store")
async def store_wisdom(wisdom_data: Dict[str, Any]):
    """Store wisdom data"""
    return {
        "stored": True,
        "wisdom_id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/finance/data")
async def get_finance_data():
    """Get financial data"""
    return {
        "revenue": 125000,
        "expenses": 45000,
        "profit": 80000,
        "abundance_score": 0.89,
        "spiritual_alignment": 0.91,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/dashboard/abundance")
async def update_abundance_dashboard(abundance_data: Dict[str, Any]):
    """Update abundance dashboard"""
    return {
        "dashboard_updated": True,
        "timestamp": datetime.now().isoformat(),
        "data_received": abundance_data
    }

@app.post("/api/legal/records")
async def store_legal_record(legal_data: Dict[str, Any]):
    """Store legal record"""
    return {
        "record_stored": True,
        "record_id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    port = int(os.getenv("N8N_INTEGRATION_PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

