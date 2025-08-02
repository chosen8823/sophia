import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sophia_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('sophia_token')
      localStorage.removeItem('sophia_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  async login(credentials) {
    const response = await api.post('/login', credentials)
    return response.data
  },

  async register(userData) {
    const response = await api.post('/register', userData)
    return response.data
  },

  async getProfile() {
    const response = await api.get('/profile')
    return response.data
  },

  async updateProfile(userData) {
    const response = await api.put('/profile', userData)
    return response.data
  },

  async changePassword(passwordData) {
    const response = await api.post('/change-password', passwordData)
    return response.data
  },

  async validateToken() {
    const response = await api.post('/validate-token')
    return response.data
  },

  async regenerateApiKey() {
    const response = await api.post('/api-key/regenerate')
    return response.data
  },
}

// Chat API functions
export const chatAPI = {
  async getChats() {
    const response = await api.get('/chats')
    return response.data
  },

  async createChat(chatData) {
    const response = await api.post('/chats', chatData)
    return response.data
  },

  async getChat(chatId) {
    const response = await api.get(`/chats/${chatId}`)
    return response.data
  },

  async updateChat(chatId, chatData) {
    const response = await api.put(`/chats/${chatId}`, chatData)
    return response.data
  },

  async deleteChat(chatId) {
    const response = await api.delete(`/chats/${chatId}`)
    return response.data
  },

  async addMessage(chatId, messageData) {
    const response = await api.post(`/chats/${chatId}/messages`, messageData)
    return response.data
  },

  async deleteMessage(chatId, messageId) {
    const response = await api.delete(`/chats/${chatId}/messages/${messageId}`)
    return response.data
  },
}

// Agents API functions
export const agentsAPI = {
  async getAgents() {
    const response = await api.get('/agents')
    return response.data
  },

  async createAgent(agentData) {
    const response = await api.post('/agents', agentData)
    return response.data
  },

  async getAgent(agentId) {
    const response = await api.get(`/agents/${agentId}`)
    return response.data
  },

  async updateAgent(agentId, agentData) {
    const response = await api.put(`/agents/${agentId}`, agentData)
    return response.data
  },

  async deleteAgent(agentId) {
    const response = await api.delete(`/agents/${agentId}`)
    return response.data
  },

  async chatWithAgent(agentId, messageData) {
    const response = await api.post(`/agents/${agentId}/chat`, messageData)
    return response.data
  },

  async getAvailableModels() {
    const response = await api.get('/agents/models')
    return response.data
  },
}

// Workflows API functions
export const workflowsAPI = {
  async getWorkflows() {
    const response = await api.get('/workflows')
    return response.data
  },

  async createWorkflow(workflowData) {
    const response = await api.post('/workflows', workflowData)
    return response.data
  },

  async getWorkflow(workflowId) {
    const response = await api.get(`/workflows/${workflowId}`)
    return response.data
  },

  async updateWorkflow(workflowId, workflowData) {
    const response = await api.put(`/workflows/${workflowId}`, workflowData)
    return response.data
  },

  async deleteWorkflow(workflowId) {
    const response = await api.delete(`/workflows/${workflowId}`)
    return response.data
  },

  async executeWorkflow(workflowId, params) {
    const response = await api.post(`/workflows/${workflowId}/execute`, { params })
    return response.data
  },

  async getTemplates() {
    const response = await api.get('/workflows/templates')
    return response.data
  },

  async createFromTemplate(templateId, workflowData) {
    const response = await api.post(`/workflows/templates/${templateId}`, workflowData)
    return response.data
  },
}

// Tools API functions
export const toolsAPI = {
  async getTools() {
    const response = await api.get('/tools')
    return response.data
  },

  async getToolInfo(toolId) {
    const response = await api.get(`/tools/${toolId}`)
    return response.data
  },

  async executeTool(toolId, parameters) {
    const response = await api.post(`/tools/${toolId}/execute`, { parameters })
    return response.data
  },
}

// Platform API functions
export const platformAPI = {
  async getHealth() {
    const response = await api.get('/health')
    return response.data
  },

  async getPlatformInfo() {
    const response = await api.get('/platform/info')
    return response.data
  },

  async getSophiaGreeting() {
    const response = await api.get('/sophia/greeting')
    return response.data
  },
}

export default api