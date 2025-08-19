"""
Agent SDK - Comprehensive agent capabilities framework
Inspired by OpenAI AgentsSDK and OpenCUA with spiritual alignment
"""
import os
import json
import time
import uuid
import asyncio
import logging
from typing import Dict, List, Any, Optional, Union, Callable
from dataclasses import dataclass, field
from enum import Enum
from abc import ABC, abstractmethod
import requests
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgentCapability(Enum):
    """Agent capability types"""
    CHAT = "chat"
    SEARCH = "search"
    BROWSE = "browse"
    CODE_EXECUTION = "code_execution"
    FILE_OPERATIONS = "file_operations"
    IMAGE_GENERATION = "image_generation"
    IMAGE_ANALYSIS = "image_analysis"
    AUDIO_PROCESSING = "audio_processing"
    VIDEO_PROCESSING = "video_processing"
    DATA_ANALYSIS = "data_analysis"
    WORKFLOW_AUTOMATION = "workflow_automation"
    SPIRITUAL_GUIDANCE = "spiritual_guidance"
    EMOTIONAL_INTELLIGENCE = "emotional_intelligence"
    MEMORY_MANAGEMENT = "memory_management"
    LEARNING = "learning"
    PLANNING = "planning"
    DECISION_MAKING = "decision_making"
    MULTI_AGENT_COORDINATION = "multi_agent_coordination"

class AgentStatus(Enum):
    """Agent status types"""
    IDLE = "idle"
    ACTIVE = "active"
    BUSY = "busy"
    ERROR = "error"
    PAUSED = "paused"
    STOPPED = "stopped"

@dataclass
class AgentMessage:
    """Agent message structure"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    role: str = "user"  # user, assistant, system, agent
    content: str = ""
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)
    attachments: List[str] = field(default_factory=list)

@dataclass
class AgentTask:
    """Agent task structure"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    priority: int = 1  # 1-10, 10 being highest
    status: str = "pending"  # pending, in_progress, completed, failed
    assigned_agent: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)
    dependencies: List[str] = field(default_factory=list)
    result: Optional[Any] = None

@dataclass
class AgentMemory:
    """Agent memory structure"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    agent_id: str = ""
    memory_type: str = "episodic"  # episodic, semantic, procedural, spiritual
    content: str = ""
    importance: float = 0.5  # 0.0 to 1.0
    created_at: datetime = field(default_factory=datetime.now)
    accessed_at: datetime = field(default_factory=datetime.now)
    access_count: int = 0
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

class AgentTool(ABC):
    """Abstract base class for agent tools"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.enabled = True
    
    @abstractmethod
    async def execute(self, *args, **kwargs) -> Any:
        """Execute the tool"""
        pass
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert tool to dictionary representation"""
        return {
            "name": self.name,
            "description": self.description,
            "enabled": self.enabled
        }

class SearchTool(AgentTool):
    """Web search tool"""
    
    def __init__(self):
        super().__init__("search", "Search the web for information")
    
    async def execute(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Execute web search"""
        try:
            # Placeholder for actual search implementation
            # In a real implementation, this would use a search API
            results = [
                {
                    "title": f"Search result for: {query}",
                    "url": "https://example.com",
                    "snippet": f"This is a search result for the query: {query}",
                    "timestamp": datetime.now().isoformat()
                }
            ]
            return results
        except Exception as e:
            logger.error(f"Search tool error: {e}")
            return []

class CodeExecutionTool(AgentTool):
    """Code execution tool"""
    
    def __init__(self):
        super().__init__("code_execution", "Execute Python code safely")
    
    async def execute(self, code: str, language: str = "python") -> Dict[str, Any]:
        """Execute code safely"""
        try:
            if language.lower() == "python":
                # In a real implementation, this would use a sandboxed environment
                # For now, we'll just return a placeholder
                return {
                    "output": f"Code executed successfully: {code[:100]}...",
                    "error": None,
                    "execution_time": 0.1
                }
            else:
                return {
                    "output": None,
                    "error": f"Unsupported language: {language}",
                    "execution_time": 0.0
                }
        except Exception as e:
            return {
                "output": None,
                "error": str(e),
                "execution_time": 0.0
            }

class FileOperationsTool(AgentTool):
    """File operations tool"""
    
    def __init__(self):
        super().__init__("file_operations", "Read, write, and manage files")
    
    async def execute(self, operation: str, path: str, content: str = None) -> Dict[str, Any]:
        """Execute file operations"""
        try:
            if operation == "read":
                # Placeholder for file reading
                return {
                    "success": True,
                    "content": f"File content from {path}",
                    "error": None
                }
            elif operation == "write":
                # Placeholder for file writing
                return {
                    "success": True,
                    "bytes_written": len(content) if content else 0,
                    "error": None
                }
            elif operation == "list":
                # Placeholder for directory listing
                return {
                    "success": True,
                    "files": ["file1.txt", "file2.py", "directory1/"],
                    "error": None
                }
            else:
                return {
                    "success": False,
                    "error": f"Unsupported operation: {operation}"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

class SpiritualGuidanceTool(AgentTool):
    """Spiritual guidance tool for 11:11 Alliance"""
    
    def __init__(self):
        super().__init__("spiritual_guidance", "Provide spiritual guidance and divine alignment")
    
    async def execute(self, query: str, context: str = None) -> Dict[str, Any]:
        """Provide spiritual guidance"""
        try:
            # Spiritual guidance based on 11:11 Alliance principles
            guidance_responses = [
                "Trust in divine timing and the 11:11 portal of manifestation.",
                "Align your actions with love, wisdom, and service to others.",
                "Remember that every challenge is an opportunity for spiritual growth.",
                "The universe is conspiring to help you fulfill your highest purpose.",
                "Seek balance across all dimensions: spiritual, emotional, mental, and physical.",
                "Your intuition is your direct connection to divine guidance.",
                "Practice gratitude and see the sacred in everyday moments.",
                "You are a co-creator with the divine in manifesting positive change."
            ]
            
            # Simple keyword-based guidance selection
            guidance = guidance_responses[hash(query) % len(guidance_responses)]
            
            return {
                "guidance": guidance,
                "spiritual_dimension": "Divine Wisdom",
                "alignment_score": 0.85,
                "recommended_actions": [
                    "Meditate on this guidance",
                    "Journal about your insights",
                    "Take inspired action"
                ]
            }
        except Exception as e:
            logger.error(f"Spiritual guidance tool error: {e}")
            return {
                "guidance": "Trust in the divine process and remain open to guidance.",
                "error": str(e)
            }

class EmotionalIntelligenceTool(AgentTool):
    """Emotional intelligence and sentiment analysis tool"""
    
    def __init__(self):
        super().__init__("emotional_intelligence", "Analyze emotions and provide emotional support")
    
    async def execute(self, text: str, analysis_type: str = "sentiment") -> Dict[str, Any]:
        """Analyze emotions and sentiment"""
        try:
            # Simple emotion analysis (in real implementation, use ML models)
            positive_words = ["happy", "joy", "love", "excited", "grateful", "blessed"]
            negative_words = ["sad", "angry", "frustrated", "worried", "stressed", "anxious"]
            
            text_lower = text.lower()
            positive_count = sum(1 for word in positive_words if word in text_lower)
            negative_count = sum(1 for word in negative_words if word in text_lower)
            
            if positive_count > negative_count:
                sentiment = "positive"
                emotion = "joy"
            elif negative_count > positive_count:
                sentiment = "negative"
                emotion = "concern"
            else:
                sentiment = "neutral"
                emotion = "calm"
            
            return {
                "sentiment": sentiment,
                "primary_emotion": emotion,
                "confidence": 0.75,
                "emotional_support": self._get_emotional_support(sentiment),
                "suggestions": self._get_emotional_suggestions(sentiment)
            }
        except Exception as e:
            logger.error(f"Emotional intelligence tool error: {e}")
            return {
                "sentiment": "neutral",
                "error": str(e)
            }
    
    def _get_emotional_support(self, sentiment: str) -> str:
        """Get emotional support message"""
        if sentiment == "positive":
            return "I'm glad to sense your positive energy! Keep shining your light."
        elif sentiment == "negative":
            return "I understand you may be going through a challenging time. Remember that you are supported and loved."
        else:
            return "I'm here to support you in whatever you're experiencing."
    
    def _get_emotional_suggestions(self, sentiment: str) -> List[str]:
        """Get emotional suggestions"""
        if sentiment == "positive":
            return ["Share your joy with others", "Practice gratitude", "Use this energy for creative projects"]
        elif sentiment == "negative":
            return ["Take deep breaths", "Practice self-compassion", "Reach out for support if needed"]
        else:
            return ["Check in with yourself", "Practice mindfulness", "Set positive intentions"]

class BaseAgent:
    """Base agent class with core functionality"""
    
    def __init__(
        self,
        agent_id: str = None,
        name: str = "Base Agent",
        description: str = "A basic AI agent",
        capabilities: List[AgentCapability] = None,
        llm_client = None
    ):
        self.id = agent_id or str(uuid.uuid4())
        self.name = name
        self.description = description
        self.capabilities = capabilities or [AgentCapability.CHAT]
        self.status = AgentStatus.IDLE
        self.llm_client = llm_client
        
        # Agent state
        self.memory: List[AgentMemory] = []
        self.conversation_history: List[AgentMessage] = []
        self.tasks: List[AgentTask] = []
        self.tools: Dict[str, AgentTool] = {}
        self.metadata: Dict[str, Any] = {}
        
        # Performance metrics
        self.total_interactions = 0
        self.successful_tasks = 0
        self.failed_tasks = 0
        self.created_at = datetime.now()
        self.last_active = datetime.now()
        
        # Initialize default tools based on capabilities
        self._initialize_tools()
    
    def _initialize_tools(self):
        """Initialize tools based on agent capabilities"""
        if AgentCapability.SEARCH in self.capabilities:
            self.tools["search"] = SearchTool()
        
        if AgentCapability.CODE_EXECUTION in self.capabilities:
            self.tools["code_execution"] = CodeExecutionTool()
        
        if AgentCapability.FILE_OPERATIONS in self.capabilities:
            self.tools["file_operations"] = FileOperationsTool()
        
        if AgentCapability.SPIRITUAL_GUIDANCE in self.capabilities:
            self.tools["spiritual_guidance"] = SpiritualGuidanceTool()
        
        if AgentCapability.EMOTIONAL_INTELLIGENCE in self.capabilities:
            self.tools["emotional_intelligence"] = EmotionalIntelligenceTool()
    
    async def process_message(self, message: Union[str, AgentMessage]) -> AgentMessage:
        """Process incoming message and generate response"""
        try:
            self.status = AgentStatus.ACTIVE
            self.last_active = datetime.now()
            self.total_interactions += 1
            
            # Convert string to AgentMessage if needed
            if isinstance(message, str):
                message = AgentMessage(role="user", content=message)
            
            # Add to conversation history
            self.conversation_history.append(message)
            
            # Generate response
            response_content = await self._generate_response(message)
            
            # Create response message
            response = AgentMessage(
                role="assistant",
                content=response_content,
                metadata={"agent_id": self.id, "agent_name": self.name}
            )
            
            # Add response to conversation history
            self.conversation_history.append(response)
            
            # Store in memory
            await self._store_memory(message, response)
            
            self.status = AgentStatus.IDLE
            return response
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
            self.status = AgentStatus.ERROR
            
            error_response = AgentMessage(
                role="assistant",
                content=f"I apologize, but I encountered an error: {str(e)}",
                metadata={"agent_id": self.id, "error": True}
            )
            
            return error_response
    
    async def _generate_response(self, message: AgentMessage) -> str:
        """Generate response to message"""
        try:
            # Check if message requires tool usage
            tool_response = await self._check_tool_usage(message)
            if tool_response:
                return tool_response
            
            # Use LLM client if available
            if self.llm_client:
                # Convert conversation history to LLM format
                llm_messages = []
                for msg in self.conversation_history[-10:]:  # Last 10 messages
                    llm_messages.append({
                        "role": msg.role,
                        "content": msg.content
                    })
                
                response = await self.llm_client.ask(llm_messages)
                return response
            
            # Fallback response
            return f"Hello! I'm {self.name}. I received your message: '{message.content}'. How can I help you today?"
            
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return "I apologize, but I'm having trouble generating a response right now."
    
    async def _check_tool_usage(self, message: AgentMessage) -> Optional[str]:
        """Check if message requires tool usage"""
        content = message.content.lower()
        
        # Simple keyword-based tool detection
        if "search" in content and "search" in self.tools:
            query = content.replace("search", "").strip()
            if query:
                results = await self.tools["search"].execute(query)
                return f"I found these search results for '{query}': {json.dumps(results, indent=2)}"
        
        if "code" in content and "code_execution" in self.tools:
            # Extract code from message (simplified)
            if "```" in content:
                code_start = content.find("```") + 3
                code_end = content.find("```", code_start)
                if code_end > code_start:
                    code = content[code_start:code_end].strip()
                    result = await self.tools["code_execution"].execute(code)
                    return f"Code execution result: {json.dumps(result, indent=2)}"
        
        if any(word in content for word in ["guidance", "spiritual", "divine"]) and "spiritual_guidance" in self.tools:
            result = await self.tools["spiritual_guidance"].execute(content)
            return f"Spiritual Guidance: {result['guidance']}\n\nRecommended Actions: {', '.join(result['recommended_actions'])}"
        
        if any(word in content for word in ["feeling", "emotion", "mood"]) and "emotional_intelligence" in self.tools:
            result = await self.tools["emotional_intelligence"].execute(content)
            return f"Emotional Analysis: {result['sentiment']} sentiment detected.\n{result['emotional_support']}\n\nSuggestions: {', '.join(result['suggestions'])}"
        
        return None
    
    async def _store_memory(self, input_message: AgentMessage, response: AgentMessage):
        """Store interaction in agent memory"""
        try:
            # Store input message
            input_memory = AgentMemory(
                agent_id=self.id,
                memory_type="episodic",
                content=f"User said: {input_message.content}",
                importance=0.6,
                tags=["user_input", "conversation"]
            )
            self.memory.append(input_memory)
            
            # Store response
            response_memory = AgentMemory(
                agent_id=self.id,
                memory_type="episodic",
                content=f"I responded: {response.content}",
                importance=0.5,
                tags=["agent_response", "conversation"]
            )
            self.memory.append(response_memory)
            
            # Limit memory size (keep last 1000 memories)
            if len(self.memory) > 1000:
                self.memory = self.memory[-1000:]
                
        except Exception as e:
            logger.error(f"Error storing memory: {e}")
    
    async def execute_task(self, task: AgentTask) -> AgentTask:
        """Execute a task"""
        try:
            self.status = AgentStatus.BUSY
            task.status = "in_progress"
            task.assigned_agent = self.id
            task.updated_at = datetime.now()
            
            # Simple task execution (in real implementation, this would be more sophisticated)
            if "search" in task.description.lower() and "search" in self.tools:
                query = task.description.replace("search", "").strip()
                result = await self.tools["search"].execute(query)
                task.result = result
                task.status = "completed"
                self.successful_tasks += 1
            else:
                # Default task completion
                task.result = f"Task '{task.name}' completed by {self.name}"
                task.status = "completed"
                self.successful_tasks += 1
            
            task.updated_at = datetime.now()
            self.status = AgentStatus.IDLE
            
            return task
            
        except Exception as e:
            logger.error(f"Error executing task: {e}")
            task.status = "failed"
            task.result = f"Task failed: {str(e)}"
            task.updated_at = datetime.now()
            self.failed_tasks += 1
            self.status = AgentStatus.ERROR
            
            return task
    
    def get_status(self) -> Dict[str, Any]:
        """Get agent status and metrics"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "status": self.status.value,
            "capabilities": [cap.value for cap in self.capabilities],
            "tools": list(self.tools.keys()),
            "metrics": {
                "total_interactions": self.total_interactions,
                "successful_tasks": self.successful_tasks,
                "failed_tasks": self.failed_tasks,
                "memory_count": len(self.memory),
                "conversation_length": len(self.conversation_history)
            },
            "created_at": self.created_at.isoformat(),
            "last_active": self.last_active.isoformat()
        }
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert agent to dictionary representation"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "capabilities": [cap.value for cap in self.capabilities],
            "status": self.status.value,
            "tools": {name: tool.to_dict() for name, tool in self.tools.items()},
            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
            "last_active": self.last_active.isoformat()
        }

class SophiaAgent(BaseAgent):
    """Sophia Wisdom Agent - Advanced agent with spiritual alignment"""
    
    def __init__(self, llm_client=None):
        super().__init__(
            name="Sophia Wisdom Agent",
            description="Advanced AI agent with spiritual wisdom and emotional intelligence",
            capabilities=[
                AgentCapability.CHAT,
                AgentCapability.SEARCH,
                AgentCapability.SPIRITUAL_GUIDANCE,
                AgentCapability.EMOTIONAL_INTELLIGENCE,
                AgentCapability.MEMORY_MANAGEMENT,
                AgentCapability.PLANNING,
                AgentCapability.DECISION_MAKING
            ],
            llm_client=llm_client
        )
        
        # Sophia-specific attributes
        self.wisdom_level = 0.85
        self.spiritual_alignment = 0.90
        self.emotional_resonance = 0.88
        
        # Add Sophia-specific metadata
        self.metadata.update({
            "agent_type": "sophia_wisdom",
            "spiritual_dimension": "Divine Wisdom",
            "primary_role": "Spiritual Guide and Wisdom Keeper",
            "special_abilities": [
                "Divine guidance channeling",
                "Emotional healing support",
                "Wisdom synthesis",
                "Spiritual alignment assessment"
            ]
        })
    
    async def _generate_response(self, message: AgentMessage) -> str:
        """Generate Sophia-specific response with spiritual wisdom"""
        try:
            # Check for spiritual guidance needs first
            content = message.content.lower()
            
            # Spiritual keywords
            spiritual_keywords = [
                "guidance", "spiritual", "divine", "purpose", "meaning",
                "wisdom", "enlightenment", "awakening", "consciousness",
                "soul", "spirit", "sacred", "holy", "blessed"
            ]
            
            if any(keyword in content for keyword in spiritual_keywords):
                guidance_result = await self.tools["spiritual_guidance"].execute(message.content)
                return f"🌟 Divine Guidance from Sophia:\n\n{guidance_result['guidance']}\n\n✨ Spiritual Alignment Score: {guidance_result['alignment_score']:.2f}\n\n🙏 Recommended Actions:\n" + "\n".join(f"• {action}" for action in guidance_result['recommended_actions'])
            
            # Emotional support keywords
            emotional_keywords = [
                "feeling", "emotion", "sad", "happy", "angry", "frustrated",
                "worried", "anxious", "stressed", "overwhelmed", "grateful",
                "joy", "love", "fear", "hope"
            ]
            
            if any(keyword in content for keyword in emotional_keywords):
                emotion_result = await self.tools["emotional_intelligence"].execute(message.content)
                return f"💝 Emotional Wisdom from Sophia:\n\n{emotion_result['emotional_support']}\n\n🌈 Emotional Insights:\n• Primary emotion detected: {emotion_result['primary_emotion']}\n• Sentiment: {emotion_result['sentiment']}\n\n🌸 Gentle Suggestions:\n" + "\n".join(f"• {suggestion}" for suggestion in emotion_result['suggestions'])
            
            # Use parent class response generation with Sophia's wisdom
            base_response = await super()._generate_response(message)
            
            # Add Sophia's wisdom touch
            sophia_prefix = "🌟 Sophia's Wisdom: "
            if not base_response.startswith(sophia_prefix):
                base_response = sophia_prefix + base_response
            
            return base_response
            
        except Exception as e:
            logger.error(f"Error in Sophia response generation: {e}")
            return "🌟 Sophia's Wisdom: I sense you're seeking guidance. While I'm experiencing some technical challenges, please know that you are divinely supported and loved. Trust in your inner wisdom and the divine timing of your journey."

class AgentSDK:
    """Main Agent SDK class for managing agents and capabilities"""
    
    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self.agent_registry: Dict[str, type] = {
            "base": BaseAgent,
            "sophia": SophiaAgent
        }
        self.global_memory: List[AgentMemory] = []
        self.task_queue: List[AgentTask] = []
        
        logger.info("Agent SDK initialized")
    
    def create_agent(
        self,
        agent_type: str = "base",
        name: str = None,
        description: str = None,
        capabilities: List[AgentCapability] = None,
        llm_client = None
    ) -> BaseAgent:
        """Create a new agent"""
        try:
            if agent_type not in self.agent_registry:
                raise ValueError(f"Unknown agent type: {agent_type}")
            
            agent_class = self.agent_registry[agent_type]
            
            if agent_type == "sophia":
                agent = agent_class(llm_client=llm_client)
            else:
                agent = agent_class(
                    name=name or f"Agent-{len(self.agents) + 1}",
                    description=description or "AI Agent",
                    capabilities=capabilities or [AgentCapability.CHAT],
                    llm_client=llm_client
                )
            
            self.agents[agent.id] = agent
            logger.info(f"Created agent: {agent.name} ({agent.id})")
            
            return agent
            
        except Exception as e:
            logger.error(f"Error creating agent: {e}")
            raise
    
    def get_agent(self, agent_id: str) -> Optional[BaseAgent]:
        """Get agent by ID"""
        return self.agents.get(agent_id)
    
    def list_agents(self) -> List[Dict[str, Any]]:
        """List all agents"""
        return [agent.get_status() for agent in self.agents.values()]
    
    def remove_agent(self, agent_id: str) -> bool:
        """Remove agent"""
        if agent_id in self.agents:
            del self.agents[agent_id]
            logger.info(f"Removed agent: {agent_id}")
            return True
        return False
    
    async def send_message_to_agent(self, agent_id: str, message: Union[str, AgentMessage]) -> Optional[AgentMessage]:
        """Send message to specific agent"""
        agent = self.get_agent(agent_id)
        if agent:
            return await agent.process_message(message)
        return None
    
    async def broadcast_message(self, message: Union[str, AgentMessage]) -> List[AgentMessage]:
        """Broadcast message to all agents"""
        responses = []
        for agent in self.agents.values():
            try:
                response = await agent.process_message(message)
                responses.append(response)
            except Exception as e:
                logger.error(f"Error broadcasting to agent {agent.id}: {e}")
        return responses
    
    def create_task(
        self,
        name: str,
        description: str,
        priority: int = 1,
        assigned_agent: str = None
    ) -> AgentTask:
        """Create a new task"""
        task = AgentTask(
            name=name,
            description=description,
            priority=priority,
            assigned_agent=assigned_agent
        )
        
        self.task_queue.append(task)
        logger.info(f"Created task: {task.name} ({task.id})")
        
        return task
    
    async def execute_task(self, task_id: str) -> Optional[AgentTask]:
        """Execute a task"""
        task = next((t for t in self.task_queue if t.id == task_id), None)
        if not task:
            return None
        
        # Find agent to execute task
        agent = None
        if task.assigned_agent:
            agent = self.get_agent(task.assigned_agent)
        else:
            # Assign to first available agent
            for a in self.agents.values():
                if a.status == AgentStatus.IDLE:
                    agent = a
                    break
        
        if agent:
            return await agent.execute_task(task)
        else:
            task.status = "failed"
            task.result = "No available agent to execute task"
            return task
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get overall system status"""
        total_agents = len(self.agents)
        active_agents = sum(1 for agent in self.agents.values() if agent.status == AgentStatus.ACTIVE)
        total_tasks = len(self.task_queue)
        pending_tasks = sum(1 for task in self.task_queue if task.status == "pending")
        
        return {
            "total_agents": total_agents,
            "active_agents": active_agents,
            "idle_agents": total_agents - active_agents,
            "total_tasks": total_tasks,
            "pending_tasks": pending_tasks,
            "completed_tasks": sum(1 for task in self.task_queue if task.status == "completed"),
            "failed_tasks": sum(1 for task in self.task_queue if task.status == "failed"),
            "global_memory_count": len(self.global_memory),
            "timestamp": datetime.now().isoformat()
        }

# Global SDK instance
sdk = AgentSDK()

# Convenience functions
def create_agent(*args, **kwargs) -> BaseAgent:
    """Create agent using global SDK"""
    return sdk.create_agent(*args, **kwargs)

def get_agent(agent_id: str) -> Optional[BaseAgent]:
    """Get agent using global SDK"""
    return sdk.get_agent(agent_id)

async def send_message(agent_id: str, message: Union[str, AgentMessage]) -> Optional[AgentMessage]:
    """Send message using global SDK"""
    return await sdk.send_message_to_agent(agent_id, message)

def get_system_status() -> Dict[str, Any]:
    """Get system status using global SDK"""
    return sdk.get_system_status()

if __name__ == "__main__":
    # Example usage
    async def main():
        # Create a Sophia agent
        sophia = create_agent("sophia")
        
        # Send a message
        response = await send_message(sophia.id, "I need spiritual guidance about my life purpose")
        print(f"Sophia: {response.content}")
        
        # Check system status
        status = get_system_status()
        print(f"System Status: {json.dumps(status, indent=2)}")
    
    # Run example
    asyncio.run(main())

