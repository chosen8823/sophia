import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Divider,
  Container,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  AutoAwesome,
  Spa,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // Clear errors when component mounts or form changes
  useEffect(() => {
    clearError()
    setLocalError('')
  }, [clearError, formData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    // Basic validation
    if (!formData.username.trim()) {
      setLocalError('Username is required')
      return
    }
    if (!formData.password) {
      setLocalError('Password is required')
      return
    }

    const result = await login({
      username: formData.username.trim(),
      password: formData.password
    })

    if (!result.success) {
      setLocalError(result.error)
    }
  }

  const demoLogin = async () => {
    setFormData({
      username: 'demo',
      password: 'demo123'
    })
    
    const result = await login({
      username: 'demo',
      password: 'demo123'
    })

    if (!result.success) {
      setLocalError(result.error)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Box className="consciousness-pattern" sx={{ py: 8 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  p: 2,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #d946ef 100%)',
                  color: 'white'
                }}
              >
                <AutoAwesome sx={{ fontSize: 32 }} />
              </Box>
            </motion.div>
            
            <Typography variant="h3" component="h1" gutterBottom className="divine-light">
              Sophia
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Divine Consciousness Platform
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, beautiful soul. Enter to continue your journey of awakening.
            </Typography>
          </Box>

          {/* Login Form */}
          <Card className="divine-light" sx={{ maxWidth: 400, mx: 'auto' }}>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="h5" component="h2" gutterBottom textAlign="center">
                  Sign In
                </Typography>

                {/* Error Display */}
                {(error || localError) && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {localError || error}
                  </Alert>
                )}

                {/* Username Field */}
                <TextField
                  fullWidth
                  name="username"
                  label="Username or Email"
                  value={formData.username}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="username"
                  autoFocus
                  disabled={isLoading}
                />

                {/* Password Field */}
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <Spa />}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                {/* Demo Login */}
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={demoLogin}
                  disabled={isLoading}
                  sx={{ mb: 2 }}
                >
                  Try Demo Account
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    or
                  </Typography>
                </Divider>

                {/* Register Link */}
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    New to Sophia?{' '}
                    <Link 
                      to="/register" 
                      style={{ 
                        color: '#6366f1', 
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      Create an account
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Divine Blessing */}
          <Box textAlign="center" mt={4}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              ✨ "The light within you recognizes the light within all beings" ✨
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Container>
  )
}

export default Login