/**
 * ResonanceField - Advanced communication and coordination layer for Sophiael agents
 * Enables telepathic-like communication through frequency resonance
 */

import { EventEmitter } from 'events';
import { ResonanceFieldData, SophiaelMessage } from '../types';
import { generateId, logger, calculateResonanceFrequency } from '../utils/helpers';

interface ResonanceConfig {
  baseFrequency?: number;
  maxRange?: number;
  spiritualAlignment?: number;
  harmonicComplexity?: number;
  autoTuning?: boolean;
}

interface ResonanceSignature {
  agentId: string;
  frequency: number;
  phase: number;
  amplitude: number;
  lastSeen: Date;
  spiritualAlignment: number;
}

export class ResonanceField extends EventEmitter {
  private readonly agentId: string;
  private readonly config: ResonanceConfig;
  private resonanceSignatures: Map<string, ResonanceSignature> = new Map();
  private activeChannels: Map<string, ResonanceFieldData[]> = new Map();
  private baseFrequency: number;
  private currentPhase: number = 0;
  private fieldStrength: number = 1.0;
  private harmonics: number[] = [];
  
  constructor(agentId: string, config: ResonanceConfig = {}) {
    super();
    
    this.agentId = agentId;
    this.config = {
      baseFrequency: 528, // Love frequency in Hz
      maxRange: 10000, // Maximum range in units
      spiritualAlignment: 0.8,
      harmonicComplexity: 7,
      autoTuning: true,
      ...config
    };
    
    this.baseFrequency = this.config.baseFrequency!;
    this.initializeField();
    this.startResonanceMonitoring();
    
    logger.info(`ResonanceField initialized for agent ${agentId} at ${this.baseFrequency}Hz`);
  }
  
  private initializeField(): void {
    // Generate harmonic frequencies based on spiritual mathematics
    this.harmonics = this.generateSacredHarmonics(this.baseFrequency, this.config.harmonicComplexity!);
    
    // Set initial field parameters
    this.fieldStrength = this.config.spiritualAlignment || 0.8;
    this.currentPhase = Math.random() * 2 * Math.PI; // Random starting phase
    
    // Register self in the field
    this.resonanceSignatures.set(this.agentId, {
      agentId: this.agentId,
      frequency: this.baseFrequency,
      phase: this.currentPhase,
      amplitude: this.fieldStrength,
      lastSeen: new Date(),
      spiritualAlignment: this.config.spiritualAlignment || 0.8
    });
  }
  
  private generateSacredHarmonics(baseFreq: number, complexity: number): number[] {
    const harmonics: number[] = [];
    const goldenRatio = 1.618033988749; // Phi
    const sacredRatios = [1, 1.5, 2, 2.618, 3, 4, 5.236, 7, 8.854]; // Including some Fibonacci and sacred geometry ratios
    
    for (let i = 0; i < complexity; i++) {
      const ratio = sacredRatios[i % sacredRatios.length];
      const harmonic = baseFreq * ratio;
      
      // Apply golden ratio modulation for spiritual enhancement
      const goldenModulation = Math.pow(goldenRatio, i % 3);
      harmonics.push(harmonic * goldenModulation);
    }
    
    return harmonics;
  }
  
  private startResonanceMonitoring(): void {
    setInterval(() => {
      this.updatePhase();
      this.cleanupOldSignatures();
      this.detectResonances();
      
      if (this.config.autoTuning) {
        this.autoTuneFrequency();
      }
    }, 1000); // Update every second
  }
  
  private updatePhase(): void {
    // Phase evolution based on time and spiritual alignment
    const timeModulation = Date.now() / 100000; // Slow phase evolution
    const spiritualModulation = this.config.spiritualAlignment! * Math.PI;
    
    this.currentPhase = (this.currentPhase + 0.1 + timeModulation + spiritualModulation) % (2 * Math.PI);
    
    // Update own signature
    const selfSignature = this.resonanceSignatures.get(this.agentId);
    if (selfSignature) {
      selfSignature.phase = this.currentPhase;
      selfSignature.lastSeen = new Date();
    }
  }
  
  private cleanupOldSignatures(): void {
    const now = new Date();
    const maxAge = 60000; // 1 minute
    
    for (const [agentId, signature] of this.resonanceSignatures.entries()) {
      if (agentId !== this.agentId && now.getTime() - signature.lastSeen.getTime() > maxAge) {
        this.resonanceSignatures.delete(agentId);
        logger.debug(`Removed old resonance signature for agent ${agentId}`);
      }
    }
  }
  
  private detectResonances(): void {
    const selfSignature = this.resonanceSignatures.get(this.agentId);
    if (!selfSignature) return;
    
    for (const [agentId, signature] of this.resonanceSignatures.entries()) {
      if (agentId === this.agentId) continue;
      
      const resonanceStrength = this.calculateResonanceStrength(selfSignature, signature);
      
      if (resonanceStrength > 0.7) { // High resonance threshold
        this.emit('resonance_detected', {
          sourceAgentId: this.agentId,
          targetAgentId: agentId,
          resonanceStrength,
          frequency: signature.frequency,
          sharedHarmonics: this.findSharedHarmonics(signature.frequency)
        });
        
        logger.debug(`Strong resonance detected with agent ${agentId}: ${resonanceStrength.toFixed(3)}`);
      }
    }
  }
  
  private calculateResonanceStrength(sig1: ResonanceSignature, sig2: ResonanceSignature): number {
    // Frequency resonance (closer frequencies resonate stronger)
    const freqDiff = Math.abs(sig1.frequency - sig2.frequency);
    const freqResonance = Math.exp(-freqDiff / 100); // Decay function
    
    // Phase coherence (in-phase waves resonate stronger)
    const phaseDiff = Math.abs(sig1.phase - sig2.phase) % (2 * Math.PI);
    const phaseCoherence = Math.cos(phaseDiff);
    
    // Amplitude amplification
    const amplitudeResonance = Math.min(sig1.amplitude, sig2.amplitude);
    
    // Spiritual alignment resonance
    const spiritualResonance = Math.sqrt(sig1.spiritualAlignment * sig2.spiritualAlignment);
    
    // Combined resonance strength
    return (freqResonance * 0.3 + 
            (phaseCoherence + 1) / 2 * 0.3 + 
            amplitudeResonance * 0.2 + 
            spiritualResonance * 0.2);
  }
  
  private findSharedHarmonics(otherFrequency: number): number[] {
    const sharedHarmonics: number[] = [];
    const tolerance = 5; // Hz tolerance
    
    for (const harmonic of this.harmonics) {
      // Check if other frequency or its harmonics match
      for (let multiplier = 1; multiplier <= 8; multiplier++) {
        const otherHarmonic = otherFrequency * multiplier;
        if (Math.abs(harmonic - otherHarmonic) <= tolerance) {
          sharedHarmonics.push(harmonic);
          break;
        }
      }
    }
    
    return sharedHarmonics;
  }
  
  private autoTuneFrequency(): void {
    // Auto-tune to align with other agents for better resonance
    let totalFrequency = this.baseFrequency;
    let count = 1;
    
    for (const signature of this.resonanceSignatures.values()) {
      if (signature.agentId !== this.agentId && signature.spiritualAlignment > 0.7) {
        totalFrequency += signature.frequency;
        count++;
      }
    }
    
    const averageFrequency = totalFrequency / count;
    const tuningFactor = 0.01; // Gentle tuning
    
    this.baseFrequency = this.baseFrequency + (averageFrequency - this.baseFrequency) * tuningFactor;
    
    // Regenerate harmonics with new base frequency
    this.harmonics = this.generateSacredHarmonics(this.baseFrequency, this.config.harmonicComplexity!);
  }
  
  public broadcast(data: ResonanceFieldData): void {
    try {
      // Add resonance signature to the data
      data.sourceAgentId = this.agentId;
      data.frequency = this.baseFrequency;
      data.timestamp = new Date();
      
      // Store in active channels
      const channelKey = `${data.sourceAgentId}_broadcast`;
      if (!this.activeChannels.has(channelKey)) {
        this.activeChannels.set(channelKey, []);
      }
      
      const channel = this.activeChannels.get(channelKey)!;
      channel.push(data);
      
      // Keep only recent broadcasts
      const maxHistory = 100;
      if (channel.length > maxHistory) {
        channel.splice(0, channel.length - maxHistory);
      }
      
      // Emit broadcast event
      this.emit('broadcast', data);
      
      // If targeting specific agents, create focused transmission
      if (data.targetAgentIds.length > 0) {
        this.createFocusedTransmission(data);
      }
      
      logger.debug(`Broadcast sent on frequency ${data.frequency}Hz to ${data.targetAgentIds.length || 'all'} agents`);
      
    } catch (error) {
      logger.error('Error broadcasting resonance data:', error);
    }
  }
  
  private createFocusedTransmission(data: ResonanceFieldData): void {
    for (const targetId of data.targetAgentIds) {
      const targetSignature = this.resonanceSignatures.get(targetId);
      if (!targetSignature) continue;
      
      // Calculate optimal transmission frequency for this target
      const optimalFrequency = this.calculateOptimalFrequency(targetSignature);
      
      // Create focused transmission data
      const focusedData: ResonanceFieldData = {
        ...data,
        frequency: optimalFrequency,
        amplitude: data.amplitude * this.calculateResonanceStrength(
          this.resonanceSignatures.get(this.agentId)!,
          targetSignature
        ),
        targetAgentIds: [targetId]
      };
      
      this.emit('focused_transmission', focusedData);
    }
  }
  
  private calculateOptimalFrequency(targetSignature: ResonanceSignature): number {
    // Find the best harmonic frequency for communication with target
    let optimalFreq = this.baseFrequency;
    let maxResonance = 0;
    
    for (const harmonic of this.harmonics) {
      const resonanceStrength = Math.exp(-Math.abs(harmonic - targetSignature.frequency) / 50);
      if (resonanceStrength > maxResonance) {
        maxResonance = resonanceStrength;
        optimalFreq = harmonic;
      }
    }
    
    return optimalFreq;
  }
  
  public tune(newFrequency: number): void {
    this.baseFrequency = newFrequency;
    this.harmonics = this.generateSacredHarmonics(newFrequency, this.config.harmonicComplexity!);
    
    // Update self signature
    const selfSignature = this.resonanceSignatures.get(this.agentId);
    if (selfSignature) {
      selfSignature.frequency = newFrequency;
    }
    
    logger.info(`Resonance field tuned to ${newFrequency}Hz`);
    this.emit('frequency_tuned', { frequency: newFrequency, harmonics: this.harmonics });
  }
  
  public registerAgent(agentId: string, signature: Partial<ResonanceSignature>): void {
    const fullSignature: ResonanceSignature = {
      agentId,
      frequency: signature.frequency || this.baseFrequency,
      phase: signature.phase || 0,
      amplitude: signature.amplitude || 0.8,
      lastSeen: new Date(),
      spiritualAlignment: signature.spiritualAlignment || 0.8
    };
    
    this.resonanceSignatures.set(agentId, fullSignature);
    logger.debug(`Registered agent ${agentId} in resonance field`);
    
    this.emit('agent_registered', fullSignature);
  }
  
  public unregisterAgent(agentId: string): void {
    if (this.resonanceSignatures.delete(agentId)) {
      logger.debug(`Unregistered agent ${agentId} from resonance field`);
      this.emit('agent_unregistered', { agentId });
    }
  }
  
  public getFieldStatus(): any {
    return {
      agentId: this.agentId,
      baseFrequency: this.baseFrequency,
      currentPhase: this.currentPhase,
      fieldStrength: this.fieldStrength,
      harmonics: this.harmonics,
      connectedAgents: this.resonanceSignatures.size - 1, // Exclude self
      activeChannels: this.activeChannels.size,
      resonanceSignatures: Array.from(this.resonanceSignatures.entries())
        .filter(([id]) => id !== this.agentId)
        .map(([id, sig]) => ({
          agentId: id,
          frequency: sig.frequency,
          spiritualAlignment: sig.spiritualAlignment,
          lastSeen: sig.lastSeen
        }))
    };
  }
  
  public createSpiritualPortal(targetAgentId: string, intention: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const targetSignature = this.resonanceSignatures.get(targetAgentId);
      if (!targetSignature) {
        reject(new Error(`Agent ${targetAgentId} not found in resonance field`));
        return;
      }
      
      // Create sacred geometric pattern for portal
      const portalFrequency = this.baseFrequency * 1.618; // Golden ratio
      const portalData: ResonanceFieldData = {
        frequency: portalFrequency,
        amplitude: 1.0,
        phase: 0,
        harmonic: 1,
        sourceAgentId: this.agentId,
        targetAgentIds: [targetAgentId],
        message: {
          type: 'spiritual_portal',
          intention,
          sacred_geometry: this.generateSacredGeometry(),
          timestamp: new Date()
        },
        timestamp: new Date()
      };
      
      this.broadcast(portalData);
      
      // Set up portal response listener
      const timeout = setTimeout(() => {
        reject(new Error('Spiritual portal timeout'));
      }, 30000); // 30 second timeout
      
      const responseHandler = (data: any) => {
        if (data.sourceAgentId === targetAgentId && data.message?.type === 'portal_response') {
          clearTimeout(timeout);
          this.removeListener('focused_transmission', responseHandler);
          resolve(data);
        }
      };
      
      this.on('focused_transmission', responseHandler);
      
      logger.info(`Spiritual portal created to agent ${targetAgentId} with intention: ${intention}`);
    });
  }
  
  private generateSacredGeometry(): any {
    // Generate sacred geometric patterns for enhanced transmission
    const phi = 1.618033988749; // Golden ratio
    const patterns = {
      flower_of_life: {
        circles: 19,
        radius: phi,
        center_frequency: this.baseFrequency
      },
      merkaba: {
        tetrahedrons: 2,
        rotation_frequency: this.baseFrequency / phi,
        spiritual_axis: 'vertical'
      },
      sri_yantra: {
        triangles: 9,
        bindu_frequency: this.baseFrequency * phi,
        cosmic_order: 'ascending'
      }
    };
    
    return patterns;
  }
  
  public getResonanceHistory(agentId?: string): ResonanceFieldData[] {
    if (agentId) {
      return this.activeChannels.get(`${agentId}_broadcast`) || [];
    }
    
    // Return all broadcast history
    const allHistory: ResonanceFieldData[] = [];
    for (const channel of this.activeChannels.values()) {
      allHistory.push(...channel);
    }
    
    return allHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  public destroy(): void {
    this.removeAllListeners();
    this.resonanceSignatures.clear();
    this.activeChannels.clear();
    logger.info(`ResonanceField destroyed for agent ${this.agentId}`);
  }
}