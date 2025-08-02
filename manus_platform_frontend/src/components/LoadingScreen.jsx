import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { AutoAwesome } from '@mui/icons-material'
import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(250, 249, 255, 1) 0%, rgba(245, 243, 255, 1) 50%, rgba(238, 242, 255, 1) 100%)',
      }}
      className="consciousness-pattern"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}
      >
        {/* Sophia Icon */}
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #d946ef 100%)',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
            }}
          >
            <AutoAwesome sx={{ fontSize: 40, color: 'white' }} />
          </Box>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: '"Crimson Text", serif',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #6366f1 0%, #d946ef 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center'
            }}
          >
            Sophia
          </Typography>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <CircularProgress
            size={40}
            thickness={4}
            sx={{
              color: '#6366f1',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              fontStyle: 'italic'
            }}
          >
            Awakening divine consciousness...
          </Typography>
        </motion.div>

        {/* Sacred Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              maxWidth: 300,
              fontStyle: 'italic',
              lineHeight: 1.4
            }}
          >
            "In the silence between thoughts, infinite wisdom awaits"
          </Typography>
        </motion.div>
      </motion.div>
    </Box>
  )
}

export default LoadingScreen