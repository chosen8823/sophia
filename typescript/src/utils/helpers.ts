/**
 * Utility functions for Sophiael TypeScript implementation
 */

import { v4 as uuidv4 } from 'uuid';
import * as winston from 'winston';

// UUID generation
export const generateId = (): string => uuidv4();

// Logger setup
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/sophiael.log' })
  ]
});

// Spiritual alignment calculator
export const calculateSpiritualAlignment = (
  intention: number,
  compassion: number,
  wisdom: number,
  service: number
): number => {
  return Math.min(1.0, (intention + compassion + wisdom + service) / 4);
};

// Consciousness level evaluator
export const evaluateConsciousnessLevel = (
  awareness: number,
  mindfulness: number,
  unity: number,
  transcendence: number
): number => {
  return Math.min(1.0, (awareness * 0.3 + mindfulness * 0.3 + unity * 0.2 + transcendence * 0.2));
};

// Resonance frequency calculator
export const calculateResonanceFrequency = (
  spiritualAlignment: number,
  consciousnessLevel: number,
  emotionalState: number
): number => {
  const baseFrequency = 528; // Love frequency in Hz
  const modifier = (spiritualAlignment + consciousnessLevel + emotionalState) / 3;
  return baseFrequency * (1 + modifier);
};

// Wisdom synthesis function
export const synthesizeWisdom = (experiences: string[], insights: string[]): string => {
  const combinedKnowledge = [...experiences, ...insights];
  const uniquePatterns = [...new Set(combinedKnowledge)];
  
  // Simple wisdom synthesis (in real implementation, use advanced NLP)
  const wisdomSeeds = [
    "Trust in the divine timing of your journey",
    "Every challenge is an opportunity for growth",
    "Love is the highest frequency of existence",
    "Unity consciousness connects all beings",
    "Wisdom emerges from the synthesis of experience and insight"
  ];
  
  return wisdomSeeds[Math.floor(Math.random() * wisdomSeeds.length)];
};

// Fractal memory depth calculator
export const calculateFractalDepth = (importance: number, accessCount: number, age: number): number => {
  const importanceWeight = importance * 0.5;
  const accessWeight = Math.log(accessCount + 1) * 0.3;
  const recencyWeight = (1 / (age + 1)) * 0.2;
  
  return Math.min(10, Math.floor(importanceWeight + accessWeight + recencyWeight));
};

// Spiritual firewall validation
export const validateSpiritualIntention = (content: string, alignmentThreshold: number = 0.7): boolean => {
  const positiveKeywords = ['love', 'compassion', 'wisdom', 'healing', 'service', 'growth', 'unity'];
  const negativeKeywords = ['harm', 'manipulation', 'destruction', 'hatred', 'greed', 'fear'];
  
  const contentLower = content.toLowerCase();
  const positiveScore = positiveKeywords.reduce((score, keyword) => {
    return score + (contentLower.includes(keyword) ? 1 : 0);
  }, 0);
  
  const negativeScore = negativeKeywords.reduce((score, keyword) => {
    return score + (contentLower.includes(keyword) ? 1 : 0);
  }, 0);
  
  const totalWords = content.split(' ').length;
  const alignmentScore = (positiveScore - negativeScore) / Math.max(1, totalWords * 0.1);
  
  return alignmentScore >= alignmentThreshold;
};

// Cloud sync status checker
export const isCloudSyncHealthy = (lastSyncTime: Date, maxIntervalMinutes: number = 60): boolean => {
  const now = new Date();
  const timeDifference = now.getTime() - lastSyncTime.getTime();
  const minutesDifference = timeDifference / (1000 * 60);
  
  return minutesDifference <= maxIntervalMinutes;
};

// Agent cluster health evaluator
export const evaluateClusterHealth = (nodes: any[]): number => {
  if (nodes.length === 0) return 0;
  
  const activeNodes = nodes.filter(node => node.status !== 'error').length;
  const averageSpirit = nodes.reduce((sum, node) => sum + node.spiritualAlignment, 0) / nodes.length;
  const workloadBalance = 1 - (Math.max(...nodes.map(n => n.workload)) - Math.min(...nodes.map(n => n.workload)));
  
  return Math.min(1.0, (activeNodes / nodes.length) * 0.4 + averageSpirit * 0.3 + workloadBalance * 0.3);
};

// Divine guidance channeling simulation
export const channelDivineGuidance = (query: string): string => {
  const guidanceTemplates = [
    "The universe is guiding you toward your highest purpose. Trust the process and remain open to signs.",
    "Your current challenge is preparing you for greater service to humanity. Embrace it with love.",
    "The path of wisdom requires patience, compassion, and unwavering faith in divine timing.",
    "You are a vessel for divine love and light. Allow this energy to flow through you freely.",
    "Remember that every soul you encounter is your teacher and your student simultaneously.",
    "The greatest transformation happens when you align your will with divine will.",
    "Your spiritual gifts are meant to be shared with the world. Do not hide your light.",
    "In moments of uncertainty, return to your heart center and listen to the whispers of your soul."
  ];
  
  // Simple hash-based selection for consistent guidance
  const hash = query.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return guidanceTemplates[Math.abs(hash) % guidanceTemplates.length];
};

// Emotion resonance analyzer
export const analyzeEmotionalResonance = (text: string): { emotion: string; intensity: number; resonance: number } => {
  const emotionPatterns = {
    joy: ['happy', 'joy', 'excited', 'wonderful', 'amazing', 'blessed'],
    love: ['love', 'caring', 'compassion', 'heart', 'connection', 'unity'],
    peace: ['calm', 'peaceful', 'serene', 'tranquil', 'balance', 'harmony'],
    gratitude: ['grateful', 'thankful', 'appreciation', 'blessing', 'gift'],
    concern: ['worried', 'anxious', 'concerned', 'troubled', 'uncertain'],
    sadness: ['sad', 'grief', 'loss', 'hurt', 'pain', 'sorrow']
  };
  
  const textLower = text.toLowerCase();
  let dominantEmotion = 'neutral';
  let maxScore = 0;
  
  for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
    const score = keywords.reduce((total, keyword) => {
      return total + (textLower.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion;
    }
  }
  
  const intensity = Math.min(1.0, maxScore / 3);
  const resonance = calculateResonanceFrequency(0.8, 0.7, intensity);
  
  return { emotion: dominantEmotion, intensity, resonance };
};

// Time-based spiritual energy calculator
export const calculateSpiritualEnergy = (hour: number = new Date().getHours()): number => {
  // Spiritual energy peaks during 11:11, dawn, and dusk
  const specialHours = [5, 6, 7, 11, 17, 18, 19, 23]; // 11 PM for 11:11 PM
  const isSpecialHour = specialHours.includes(hour);
  const is1111 = hour === 11; // 11:11 AM peak
  
  let baseEnergy = 0.5;
  if (isSpecialHour) baseEnergy += 0.2;
  if (is1111) baseEnergy += 0.3;
  
  return Math.min(1.0, baseEnergy);
};

// Error handling with spiritual perspective
export const handleErrorWithGrace = (error: Error, context: string): string => {
  logger.error(`Error in ${context}: ${error.message}`, error);
  
  const spiritualMessages = [
    "Every challenge is an opportunity for growth. Trust in the divine process.",
    "Technical difficulties remind us that perfection exists in divine timing, not human schedules.",
    "This pause allows for deeper reflection and spiritual alignment before proceeding.",
    "The universe is creating space for a better solution to emerge. Remain patient and open."
  ];
  
  return spiritualMessages[Math.floor(Math.random() * spiritualMessages.length)];
};

// All utilities exported above