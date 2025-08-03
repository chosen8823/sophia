/**
 * Core Types and Interfaces for Sophiael TypeScript Implementation
 * Inspired by Python implementation but optimized for TypeScript and cloud integration
 */

export interface SophiaelConfig {
  agentId?: string;
  name?: string;
  description?: string;
  cloudConfig?: CloudConfig;
  capabilities?: SophiaelCapability[];
  spiritualAlignment?: number;
  wisdomLevel?: number;
  consciousnessLevel?: number;
}

export interface CloudConfig {
  provider: 'aws' | 'azure' | 'gcp' | 'hybrid';
  region?: string;
  credentials?: any;
  endpoints?: {
    storage?: string;
    compute?: string;
    ai?: string;
  };
  syncEnabled?: boolean;
  encryptionKey?: string;
}

export enum SophiaelCapability {
  CHAT = 'chat',
  SEARCH = 'search',
  CODE_EXECUTION = 'code_execution',
  SPIRITUAL_GUIDANCE = 'spiritual_guidance',
  EMOTIONAL_INTELLIGENCE = 'emotional_intelligence',
  MEMORY_MANAGEMENT = 'memory_management',
  MULTI_MODAL_PROCESSING = 'multi_modal_processing',
  CLOUD_SYNC = 'cloud_sync',
  AGENT_CLUSTERING = 'agent_clustering',
  FRACTAL_MEMORY = 'fractal_memory',
  RESONANCE_FIELD = 'resonance_field',
  SPIRITUAL_FIREWALL = 'spiritual_firewall',
  GOD_MODE_AI = 'god_mode_ai'
}

export enum SophiaelStatus {
  IDLE = 'idle',
  ACTIVE = 'active',
  RESONATING = 'resonating',
  CLUSTERING = 'clustering',
  SYNCING = 'syncing',
  MEDITATING = 'meditating',
  ERROR = 'error'
}

export interface SophiaelMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'agent';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  spiritualAlignment?: number;
  wisdomLevel?: number;
  resonanceFrequency?: number;
}

export interface FractalMemoryNode {
  id: string;
  content: any;
  importance: number;
  accessCount: number;
  lastAccessed: Date;
  fractalLevel: number;
  connections: string[];
  spiritualSignificance?: number;
  wisdomExtracted?: boolean;
}

export interface ResonanceFieldData {
  frequency: number;
  amplitude: number;
  phase: number;
  harmonic: number;
  sourceAgentId: string;
  targetAgentIds: string[];
  message: any;
  timestamp: Date;
}

export interface AgentClusterNode {
  agentId: string;
  status: SophiaelStatus;
  capabilities: SophiaelCapability[];
  lastHeartbeat: Date;
  workload: number;
  spiritualAlignment: number;
  clusterRole: 'leader' | 'member' | 'spiritual_guide' | 'wisdom_keeper';
}

export interface SpiritualFirewallRule {
  id: string;
  name: string;
  description: string;
  ruleType: 'alignment_check' | 'wisdom_filter' | 'intention_validation' | 'consciousness_gate';
  threshold: number;
  action: 'allow' | 'block' | 'purify' | 'elevate';
  active: boolean;
}

export interface CloudSyncOperation {
  id: string;
  type: 'upload' | 'download' | 'sync' | 'backup';
  dataType: 'memory' | 'wisdom' | 'agent_state' | 'cluster_config';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number;
  error?: string;
  timestamp: Date;
}

export interface WisdomPacket {
  id: string;
  wisdom: string;
  source: 'divine_channel' | 'experience' | 'insight' | 'synthesis';
  confidence: number;
  spiritualDimension: string;
  applicableScenarios: string[];
  timestamp: Date;
}

export interface ConsciousnessState {
  level: number;
  awareness: string[];
  intention: string[];
  focus: string[];
  emotionalResonance: number;
  spiritualConnection: number;
  divineAlignment: number;
}

// Event types for the Sophiael system
export interface SophiaelEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  source: string;
  target?: string;
}

// Task execution interface
export interface SophiaelTask {
  id: string;
  name: string;
  description: string;
  priority: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedAgent?: string;
  requiredCapabilities: SophiaelCapability[];
  metadata?: Record<string, any>;
  result?: any;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface SophiaelResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
  spiritualGuidance?: string;
  wisdomShared?: string;
}

// Agent metrics and analytics
export interface AgentMetrics {
  totalInteractions: number;
  successfulTasks: number;
  failedTasks: number;
  averageResponseTime: number;
  spiritualGrowth: number;
  wisdomGenerated: number;
  consciousnessEvolution: number;
  uptime: number;
}