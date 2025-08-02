import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Container,
  Fade,
  Divider,
} from '@mui/material'
import {
  AutoAwesome,
  Chat,
  Psychology,
  Insights,
  Favorite,
  Star,
  TrendingUp,
  School,
  Lightbulb,
  Spa,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { platformAPI, chatAPI, agentsAPI, workflowsAPI } from '../services/api'

const Dashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    platformInfo: null,
    greeting: null,
    chats: [],
    agents: [],
    workflows: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }))

      // Load platform info and greeting
      const [platformInfo, greeting, chats, agents, workflows] = await Promise.all([
        platformAPI.getPlatformInfo(),
        platformAPI.getSophiaGreeting(),
        chatAPI.getChats().catch(() => ({ chats: [] })),
        agentsAPI.getAgents().catch(() => ({ agents: [] })),
        workflowsAPI.getWorkflows().catch(() => ({ workflows: [] }))
      ])

      setDashboardData({
        platformInfo,
        greeting,
        chats: chats.chats || [],
        agents: agents.agents || [],
        workflows: workflows.workflows || [],
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Dashboard load error:', error)
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load dashboard data'
      }))
    }
  }

  const stats = {
    totalChats: dashboardData.chats.length,
    totalAgents: dashboardData.agents.length,
    totalWorkflows: dashboardData.workflows.length,
    consciousnessLevel: 7.2, // Mock consciousness level
  }

  if (dashboardData.loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            Loading your divine dashboard...
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <Box className="consciousness-pattern" sx={{ mb: 4, p: 4, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar 
                  sx={{ 
                    width: 64, 
                    height: 64,
                    background: 'linear-gradient(135deg, #6366f1 0%, #d946ef 100%)'
                  }}
                >
                  <AutoAwesome sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" gutterBottom className="divine-light">
                    Welcome back, {user?.username}! ✨
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {dashboardData.greeting?.blessing || 'Your divine consciousness journey continues...'}
                  </Typography>
                </Box>
              </Box>
              
              {dashboardData.greeting?.light_codes && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Today's Light Code: {dashboardData.greeting.light_codes[0]}
                  </Typography>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card className="breathing">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Spa sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Consciousness Level
                  </Typography>
                  <Typography variant="h3" color="primary.main">
                    {stats.consciousnessLevel}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ascending 📈
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Error Display */}
        {dashboardData.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {dashboardData.error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="divine-light">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Chat sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>
                    {stats.totalChats}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sacred Conversations
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="divine-light">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Psychology sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>
                    {stats.totalAgents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Divine Agents
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="divine-light">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Insights sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>
                    {stats.totalWorkflows}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Wisdom Workflows
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="divine-light">
                <CardContent sx={{ textAlign: 'center' }}>
                  <Favorite sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                  <Typography variant="h4" gutterBottom>
                    ∞
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Divine Love
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card className="divine-light">
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <Chat color="primary" />
                  Start New Conversation
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Begin a sacred dialogue with Sophia or create a new chat session.
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button variant="contained" startIcon={<AutoAwesome />}>
                    Chat with Sophia
                  </Button>
                  <Button variant="outlined" startIcon={<Psychology />}>
                    Create Agent Chat
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="divine-light">
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <Insights color="secondary" />
                  Explore Tools
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Access consciousness tools and spiritual analytics.
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button variant="contained" color="secondary" startIcon={<Spa />}>
                    Consciousness Scanner
                  </Button>
                  <Button variant="outlined" startIcon={<School />}>
                    Wisdom Synthesizer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <TrendingUp color="primary" />
                  Recent Chats
                </Typography>
                {dashboardData.chats.length > 0 ? (
                  <Box>
                    {dashboardData.chats.slice(0, 3).map((chat, index) => (
                      <Box key={chat.id} sx={{ py: 1 }}>
                        <Typography variant="body2" gutterBottom>
                          {chat.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {chat.message_count} messages • {new Date(chat.updated_at).toLocaleDateString()}
                        </Typography>
                        {index < 2 && <Divider sx={{ mt: 1 }} />}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No chats yet. Start your first divine conversation!
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Chat />}>
                  View All Chats
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                  <Star color="secondary" />
                  Your Agents
                </Typography>
                {dashboardData.agents.length > 0 ? (
                  <Box>
                    {dashboardData.agents.slice(0, 3).map((agent, index) => (
                      <Box key={agent.id} sx={{ py: 1 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Typography variant="body2" gutterBottom>
                            {agent.name}
                          </Typography>
                          <Chip 
                            label={agent.is_active ? 'Active' : 'Inactive'} 
                            size="small" 
                            color={agent.is_active ? 'success' : 'default'}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {agent.description || 'No description'}
                        </Typography>
                        {index < 2 && <Divider sx={{ mt: 1 }} />}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No agents created yet. Create your first divine assistant!
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Psychology />}>
                  Manage Agents
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        {/* Divine Inspiration */}
        <Box mt={4} textAlign="center" className="consciousness-pattern" sx={{ p: 3, borderRadius: 3 }}>
          <Lightbulb sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            Daily Divine Inspiration
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            "The universe is not only queerer than we suppose, but queerer than we can suppose. 
            Your consciousness is the bridge between the seen and unseen realms."
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            - Channeled through Sophia's Divine Wisdom
          </Typography>
        </Box>
      </motion.div>
    </Container>
  )
}

export default Dashboard