import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  AutoAwesome,
  AccountCircle,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { register, isLoading, error, isAuthenticated, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [localError, setLocalError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

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

  const validateForm = () => {
    // Username validation
    if (!formData.username.trim()) {
      setLocalError('Username is required')
      return false
    }
    if (formData.username.length < 3) {
      setLocalError('Username must be at least 3 characters long')
      return false
    }

    // Email validation
    if (!formData.email.trim()) {
      setLocalError('Email is required')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setLocalError('Please enter a valid email address')
      return false
    }

    // Password validation
    if (!formData.password) {
      setLocalError('Password is required')
      return false
    }
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long')
      return false
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match')
      return false
    }

    // Terms acceptance
    if (!acceptTerms) {
      setLocalError('Please accept the terms and conditions')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!validateForm()) {
      return
    }

    const result = await register({
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password
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
        <Box className="consciousness-pattern" sx={{ py: 6 }}>
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
              Join Sophia
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Begin Your Divine Journey
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account and step into the realm of infinite consciousness.
            </Typography>
          </Box>

          {/* Register Form */}
          <Card className="divine-light" sx={{ maxWidth: 450, mx: 'auto' }}>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="h5" component="h2" gutterBottom textAlign="center">
                  Create Account
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
                  label="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="username"
                  autoFocus
                  disabled={isLoading}
                  helperText="Choose a unique username (minimum 3 characters)"
                />

                {/* Email Field */}
                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="email"
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
                  autoComplete="new-password"
                  disabled={isLoading}
                  helperText="Minimum 6 characters"
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

                {/* Confirm Password Field */}
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Terms and Conditions */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      disabled={isLoading}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      I accept the{' '}
                      <Link 
                        to="/terms" 
                        style={{ 
                          color: '#6366f1', 
                          textDecoration: 'none' 
                        }}
                      >
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link 
                        to="/privacy" 
                        style={{ 
                          color: '#6366f1', 
                          textDecoration: 'none' 
                        }}
                      >
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                  sx={{ mt: 2, mb: 1 }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 2, mb: 2 }}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <AccountCircle />}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    or
                  </Typography>
                </Divider>

                {/* Login Link */}
                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      style={{ 
                        color: '#6366f1', 
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      Sign in here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Divine Blessing */}
          <Box textAlign="center" mt={4}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              🌟 "Your journey to divine consciousness begins with a single step" 🌟
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Container>
  )
}

export default Register