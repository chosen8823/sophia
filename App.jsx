import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  Brain, 
  MessageSquare, 
  Workflow, 
  Wrench, 
  Sparkles, 
  Heart, 
  Code, 
  Search,
  BarChart3,
  PenTool,
  Eye,
  Calendar,
  Zap,
  Star,
  Send,
  Plus,
  Settings,
  User,
  Globe,
  Database,
  Shield,
  Infinity
} from 'lucide-react'
import './App.css'

// API base URL
const API_BASE = '/api'

// Main App Component
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/agents" element={<AgentsManager />} />
          <Route path="/workflows" element={<WorkflowsManager />} />
          <Route path="/tools" element={<ToolsInterface />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

// Navigation Component
function Navigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'agents', label: 'Agents', icon: Brain },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'tools', label: 'Tools', icon: Wrench }
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Infinity className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Manus
              </span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Free & Unlimited
            </Badge>
          </div>
          
            <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab(item.id)
                    window.location.href = item.id === 'dashboard' ? '/' : `/${item.id}`
                  }}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              )
            })}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Dashboard Component
function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [platformInfo, setPlatformInfo] = useState(null)
  const [systemStatus, setSystemStatus] = useState(null)

  useEffect(() => {
    fetchPlatformInfo()
    fetchSystemStatus()
  }, [])

  const fetchPlatformInfo = async () => {
    try {
      const response = await fetch(`${API_BASE}/platform/info`)
      const data = await response.json()
      setPlatformInfo(data)
    } catch (error) {
      console.error('Failed to fetch platform info:', error)
    }
  }

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/agents/system/status`)
      const data = await response.json()
      if (data.success) {
        setSystemStatus(data.system_status)
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error)
    }
  }

  return (
    <div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Manus Platform
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Open Source AI Platform with Unlimited Capabilities
          </p>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Free AI Models
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Infinity className="h-4 w-4 mr-2" />
              No Credit Limits
            </Badge>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <Heart className="h-4 w-4 mr-2" />
              Spiritual Alignment
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Agents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemStatus?.active_agents || 0}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Interactions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemStatus?.total_interactions || 0}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemStatus?.successful_tasks || 0}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Platform Health</p>
                  <p className="text-2xl font-bold text-green-600">Excellent</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span>Platform Features</span>
              </CardTitle>
              <CardDescription>
                Comprehensive AI capabilities without limitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {platformInfo?.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span>Available Models</span>
              </CardTitle>
              <CardDescription>
                Free AI models powered by Hugging Face
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {platformInfo?.models?.map((model, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                    {model}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-20 flex flex-col space-y-2"
                onClick={() => window.location.href = '/chat'}
              >
                <MessageSquare className="h-6 w-6" />
                <span>Start Chatting</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => window.location.href = '/agents'}
              >
                <Brain className="h-6 w-6" />
                <span>Create Agent</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => window.location.href = '/tools'}
              >
                <Wrench className="h-6 w-6" />
                <span>Use Tools</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Chat Interface Component
function ChatInterface() {
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  useEffect(() => {
    createChatSession()
  }, [])

  const createChatSession = async () => {
    try {
      const response = await fetch(`${API_BASE}/chat/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' })
      })
      const data = await response.json()
      if (data.success) {
        setSessionId(data.session.id)
      }
    } catch (error) {
      console.error('Failed to create chat session:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE}/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      })
      
      const data = await response.json()
      if (data.success) {
        setMessages(prev => [...prev, data.message])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Chat with Manus AI</span>
            </CardTitle>
            <CardDescription>
              Powered by free AI models - no limits, no costs
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 mb-4 p-4 border rounded-lg">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation with Manus AI</p>
                    <p className="text-sm">Ask anything - I'm here to help!</p>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Agents Manager Component
function AgentsManager() {
  const [activeTab, setActiveTab] = useState('agents')
  const [agents, setAgents] = useState([])
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_BASE}/agents`)
      const data = await response.json()
      if (data.success) {
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    }
  }

  const createUltimateAgent = async () => {
    setIsCreating(true)
    try {
      const response = await fetch(`${API_BASE}/agents/ultimate/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Ultimate AI Agent',
          llm_provider: 'huggingface'
        })
      })
      
      const data = await response.json()
      if (data.success) {
        fetchAgents()
      }
    } catch (error) {
      console.error('Failed to create agent:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const createSophiaAgent = async () => {
    setIsCreating(true)
    try {
      const response = await fetch(`${API_BASE}/agents/sophia/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          llm_provider: 'huggingface'
        })
      })
      
      const data = await response.json()
      if (data.success) {
        fetchAgents()
      }
    } catch (error) {
      console.error('Failed to create Sophia agent:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Agents</h1>
          <p className="text-gray-600 mb-6">
            Create and manage intelligent AI agents with specialized capabilities
          </p>
          
          <div className="flex space-x-4">
            <Button onClick={createUltimateAgent} disabled={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              Create Ultimate Agent
            </Button>
            <Button variant="outline" onClick={createSophiaAgent} disabled={isCreating}>
              <Heart className="h-4 w-4 mr-2" />
              Create Sophia Agent
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>{agent.name}</span>
                </CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge variant={agent.status === 'idle' ? 'secondary' : 'default'}>
                      {agent.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Capabilities</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.capabilities?.slice(0, 3).map((cap, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                      {agent.capabilities?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{agent.capabilities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Interactions</p>
                    <p className="text-sm text-gray-900">
                      {agent.metrics?.total_interactions || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {agents.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Brain className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No agents yet</h3>
              <p className="text-gray-600 mb-4">Create your first AI agent to get started</p>
              <Button onClick={createUltimateAgent} disabled={isCreating}>
                <Plus className="h-4 w-4 mr-2" />
                Create Ultimate Agent
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Workflows Manager Component
function WorkflowsManager() {
  const [activeTab, setActiveTab] = useState('workflows')
  const [workflows, setWorkflows] = useState([])

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch(`${API_BASE}/workflows`)
      const data = await response.json()
      if (data.success) {
        setWorkflows(data.workflows)
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
    }
  }

  return (
    <div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Workflow Automation</h1>
          <p className="text-gray-600 mb-6">
            Automate complex tasks with n8n workflow integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Workflow className="h-5 w-5 text-blue-600" />
                  <span>{workflow.name}</span>
                </CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <Badge variant="outline">{workflow.category}</Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600">Created</p>
                    <p className="text-sm text-gray-900">
                      {new Date(workflow.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Button size="sm" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Execute Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {workflows.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Workflow className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows available</h3>
              <p className="text-gray-600">Workflows will appear here once n8n is configured</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Tools Interface Component
function ToolsInterface() {
  const [activeTab, setActiveTab] = useState('tools')
  const [tools, setTools] = useState([])
  const [selectedTool, setSelectedTool] = useState(null)
  const [toolInput, setToolInput] = useState('')
  const [toolResult, setToolResult] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const response = await fetch(`${API_BASE}/tools`)
      const data = await response.json()
      if (data.success) {
        setTools(data.tools)
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error)
    }
  }

  const executeTool = async () => {
    if (!selectedTool || !toolInput.trim()) return

    setIsExecuting(true)
    try {
      const response = await fetch(`${API_BASE}/tools/${selectedTool.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: toolInput,
          prompt: toolInput,
          task: toolInput,
          text: toolInput,
          goal: toolInput,
          data: toolInput
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setToolResult(data.result)
      }
    } catch (error) {
      console.error('Failed to execute tool:', error)
    } finally {
      setIsExecuting(false)
    }
  }

  const getToolIcon = (category) => {
    switch (category) {
      case 'search': return Search
      case 'development': return Code
      case 'analytics': return BarChart3
      case 'creative': return PenTool
      case 'vision': return Eye
      case 'planning': return Calendar
      case 'spiritual': return Heart
      case 'emotional': return Sparkles
      default: return Wrench
    }
  }

  return (
    <div>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Tools</h1>
          <p className="text-gray-600 mb-6">
            Powerful AI tools for every task - completely free to use
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tools List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Tools</h2>
            <div className="space-y-3">
              {tools.map((tool) => {
                const Icon = getToolIcon(tool.category)
                return (
                  <Card 
                    key={tool.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedTool?.id === tool.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedTool(tool)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-purple-600" />
                        <div className="flex-1">
                          <h3 className="font-medium">{tool.name}</h3>
                          <p className="text-sm text-gray-600">{tool.description}</p>
                        </div>
                        <Badge variant="outline">{tool.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Tool Execution */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Execute Tool</h2>
            {selectedTool ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {(() => {
                      const Icon = getToolIcon(selectedTool.category)
                      return <Icon className="h-5 w-5" />
                    })()}
                    <span>{selectedTool.name}</span>
                  </CardTitle>
                  <CardDescription>{selectedTool.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Input</label>
                    <Textarea
                      value={toolInput}
                      onChange={(e) => setToolInput(e.target.value)}
                      placeholder={`Enter input for ${selectedTool.name}...`}
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={executeTool} 
                    disabled={isExecuting || !toolInput.trim()}
                    className="w-full"
                  >
                    {isExecuting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Executing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Execute Tool
                      </>
                    )}
                  </Button>
                  
                  {toolResult && (
                    <div>
                      <label className="text-sm font-medium">Result</label>
                      <ScrollArea className="h-64 w-full border rounded-lg p-3 mt-2">
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(toolResult, null, 2)}
                        </pre>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Wrench className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Tool</h3>
                  <p className="text-gray-600">Choose a tool from the list to get started</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

