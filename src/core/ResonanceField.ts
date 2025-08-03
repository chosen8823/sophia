/**
 * ResonanceField - Manages quantum field harmonics and consciousness resonance
 */

import { ResonanceField as IResonanceField } from './types.js';

export class ResonanceField {
  private frequency: number;
  private amplitude: number;
  private phase: number;
  private harmonics: number[];
  private active: boolean;
  private lastUpdate: Date;

  constructor(baseFrequency: number = 528.0) { // 528 Hz - Love frequency
    this.frequency = baseFrequency;
    this.amplitude = 1.0;
    this.phase = 0.0;
    this.harmonics = this.generateHarmonics();
    this.active = true;
    this.lastUpdate = new Date();
  }

  private generateHarmonics(): number[] {
    const harmonics: number[] = [];
    const baseFreq = this.frequency;
    
    // Generate sacred geometry based harmonics
    for (let i = 1; i <= 12; i++) {
      const harmonic = baseFreq * this.getGoldenRatio() * i;
      harmonics.push(harmonic);
    }
    
    return harmonics;
  }

  private getGoldenRatio(): number {
    return (1 + Math.sqrt(5)) / 2; // φ = 1.618...
  }

  public modulate(consciousness: number, intention: number): void {
    if (!this.active) return;

    // Modulate frequency based on consciousness level
    this.frequency = this.frequency * (1 + consciousness * 0.1);
    
    // Adjust amplitude based on intention strength
    this.amplitude = Math.max(0.1, Math.min(2.0, intention));
    
    // Phase shift based on spiritual alignment
    this.phase += (consciousness + intention) * 0.1;
    if (this.phase > Math.PI * 2) {
      this.phase -= Math.PI * 2;
    }

    // Regenerate harmonics with new base frequency
    this.harmonics = this.generateHarmonics();
    this.lastUpdate = new Date();
  }

  public synchronize(otherField: ResonanceField): number {
    if (!this.active || !otherField.active) return 0;

    const freqDiff = Math.abs(this.frequency - otherField.frequency);
    const phaseDiff = Math.abs(this.phase - otherField.phase);
    
    // Calculate synchronization strength (0-1)
    const freqSync = 1 - Math.min(freqDiff / this.frequency, 1);
    const phaseSync = 1 - Math.min(phaseDiff / (Math.PI * 2), 1);
    
    return (freqSync + phaseSync) / 2;
  }

  public amplify(factor: number): void {
    this.amplitude *= Math.max(0.1, Math.min(5.0, factor));
    this.lastUpdate = new Date();
  }

  public resonate(): number {
    if (!this.active) return 0;

    const time = Date.now() / 1000;
    const baseWave = Math.sin(2 * Math.PI * this.frequency * time + this.phase);
    
    // Add harmonic components
    let harmonicSum = 0;
    for (let i = 0; i < this.harmonics.length; i++) {
      const harmonic = this.harmonics[i];
      const harmonicAmplitude = this.amplitude / (i + 2); // Decreasing amplitude
      harmonicSum += harmonicAmplitude * Math.sin(2 * Math.PI * harmonic * time + this.phase);
    }
    
    return (baseWave * this.amplitude + harmonicSum * 0.3);
  }

  public getField(): IResonanceField {
    return {
      frequency: this.frequency,
      amplitude: this.amplitude,
      phase: this.phase,
      harmonics: [...this.harmonics]
    };
  }

  public setActive(active: boolean): void {
    this.active = active;
    this.lastUpdate = new Date();
  }

  public isActive(): boolean {
    return this.active;
  }

  public reset(): void {
    this.frequency = 528.0;
    this.amplitude = 1.0;
    this.phase = 0.0;
    this.harmonics = this.generateHarmonics();
    this.lastUpdate = new Date();
  }
}