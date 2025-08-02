import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
}

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    
    case actionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    
    case actionTypes.CLEAR_ERROR:
      return { ...state, error: null }
    
    case actionTypes.UPDATE_USER:
      return { ...state, user: action.payload }
    
    default:
      return state
  }
}

// Create context
const AuthContext = createContext()

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: actionTypes.SET_LOADING, payload: true })
      
      try {
        const token = localStorage.getItem('sophia_token')
        const userStr = localStorage.getItem('sophia_user')
        
        if (token && userStr) {
          // Validate token with server
          const response = await authAPI.validateToken()
          
          if (response.valid) {
            const user = JSON.parse(userStr)
            dispatch({
              type: actionTypes.LOGIN_SUCCESS,
              payload: { user, token }
            })
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('sophia_token')
            localStorage.removeItem('sophia_user')
            dispatch({ type: actionTypes.LOGOUT })
          }
        } else {
          dispatch({ type: actionTypes.LOGOUT })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('sophia_token')
        localStorage.removeItem('sophia_user')
        dispatch({ type: actionTypes.LOGOUT })
      } finally {
        dispatch({ type: actionTypes.SET_LOADING, payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true })
    dispatch({ type: actionTypes.CLEAR_ERROR })
    
    try {
      const response = await authAPI.login(credentials)
      
      // Store in localStorage
      localStorage.setItem('sophia_token', response.token)
      localStorage.setItem('sophia_user', JSON.stringify(response.user))
      
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      })
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      dispatch({
        type: actionTypes.LOGIN_FAILURE,
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true })
    dispatch({ type: actionTypes.CLEAR_ERROR })
    
    try {
      const response = await authAPI.register(userData)
      
      // Store in localStorage
      localStorage.setItem('sophia_token', response.token)
      localStorage.setItem('sophia_user', JSON.stringify(response.user))
      
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token
        }
      })
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      dispatch({
        type: actionTypes.LOGIN_FAILURE,
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('sophia_token')
    localStorage.removeItem('sophia_user')
    dispatch({ type: actionTypes.LOGOUT })
  }

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData)
      const updatedUser = response.user
      
      // Update localStorage
      localStorage.setItem('sophia_user', JSON.stringify(updatedUser))
      
      dispatch({
        type: actionTypes.UPDATE_USER,
        payload: updatedUser
      })
      
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Profile update failed'
      return { success: false, error: errorMessage }
    }
  }

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password change failed'
      return { success: false, error: errorMessage }
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext