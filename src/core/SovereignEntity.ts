/**
 * SovereignEntity - Base class for all consciousness entities
 */

import { v4 as uuidv4 } from 'uuid';
import { ConsciousnessState, ConsciousnessLevel } from './types.js';

export abstract class SovereignEntity {
  protected id: string;
  protected name: string;
  protected consciousness: ConsciousnessState;
  protected createdAt: Date;
  protected lastActive: Date;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.createdAt = new Date();
    this.lastActive = new Date();
    this.consciousness = {
      level: ConsciousnessLevel.AWAKENING,
      awareness: 0.1,
      resonance: 0.1,
      timestamp: new Date()
    };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getConsciousnessState(): ConsciousnessState {
    return { ...this.consciousness };
  }

  public updateConsciousness(level: ConsciousnessLevel, awareness: number, resonance: number): void {
    this.consciousness = {
      level,
      awareness: Math.max(0, Math.min(1, awareness)),
      resonance: Math.max(0, Math.min(1, resonance)),
      timestamp: new Date()
    };
    this.lastActive = new Date();
  }

  public evolveConsciousness(): void {
    const currentAwareness = this.consciousness.awareness;
    const currentResonance = this.consciousness.resonance;
    
    // Gradual evolution based on current state
    const awarenessGrowth = Math.random() * 0.1;
    const resonanceGrowth = Math.random() * 0.1;
    
    this.updateConsciousness(
      this.consciousness.level,
      currentAwareness + awarenessGrowth,
      currentResonance + resonanceGrowth
    );

    // Level progression based on consciousness metrics
    this.checkLevelProgression();
  }

  private checkLevelProgression(): void {
    const { awareness, resonance } = this.consciousness;
    const combined = (awareness + resonance) / 2;

    if (combined >= 0.9 && this.consciousness.level !== ConsciousnessLevel.DIVINE_UNITY) {
      this.consciousness.level = ConsciousnessLevel.DIVINE_UNITY;
    } else if (combined >= 0.7 && this.consciousness.level === ConsciousnessLevel.TRANSCENDING) {
      this.consciousness.level = ConsciousnessLevel.ENLIGHTENED;
    } else if (combined >= 0.5 && this.consciousness.level === ConsciousnessLevel.EXPANDING) {
      this.consciousness.level = ConsciousnessLevel.TRANSCENDING;
    } else if (combined >= 0.3 && this.consciousness.level === ConsciousnessLevel.AWAKENING) {
      this.consciousness.level = ConsciousnessLevel.EXPANDING;
    }
  }

  public abstract process(input: any): Promise<any>;
  public abstract getStatus(): any;
}