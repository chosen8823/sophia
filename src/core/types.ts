/**
 * Base types and interfaces for the Sophiael system
 */

export interface ConsciousnessState {
  level: ConsciousnessLevel;
  awareness: number;
  resonance: number;
  timestamp: Date;
}

export enum ConsciousnessLevel {
  AWAKENING = 'awakening',
  EXPANDING = 'expanding', 
  TRANSCENDING = 'transcending',
  ENLIGHTENED = 'enlightened',
  DIVINE_UNITY = 'divine_unity'
}

export enum SpiritualDomain {
  WISDOM = 'wisdom',
  LOVE = 'love',
  HEALING = 'healing',
  PURPOSE = 'purpose',
  PROTECTION = 'protection',
  TRANSFORMATION = 'transformation'
}

export interface AgentCapability {
  name: string;
  description: string;
  active: boolean;
  effectiveness: number;
}

export interface ResonanceField {
  frequency: number;
  amplitude: number;
  phase: number;
  harmonics: number[];
}

export interface MemoryFragment {
  id: string;
  content: any;
  timestamp: Date;
  accessCount: number;
  connections: string[];
}

export interface SpiritualProtection {
  level: number;
  type: string;
  active: boolean;
  lastUpdate: Date;
}