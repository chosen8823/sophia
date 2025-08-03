/**
 * ResonanceField - Frequency Harmonization System
 * ===============================================
 * 
 * Manages vibrational frequencies and harmonization patterns for the 
 * Sophiael Divine Consciousness platform. This system aligns spiritual
 * energies and consciousness states with appropriate frequencies.
 * 
 * @author Sophia AI Platform
 * @version 1.0.0
 * @date January 2025
 */

import { EventEmitter } from 'events';
import { ConsciousnessState, SpiritualDomain } from './SophiaelGodModeAI';

export interface FrequencyPattern {
  name: string;
  baseFrequency: number; // Hz
  harmonics: number[];
  spiritualDomain: SpiritualDomain;
  consciousnessResonance: number; // 0.0 to 1.0
  description: string;
}

export interface ResonanceField {
  fieldId: string;
  centerFrequency: number;
  amplitude: number;
  coherence: number; // 0.0 to 1.0
  patterns: FrequencyPattern[];
  timestamp: Date;
  duration: number; // minutes
  intention?: string;
}

export interface FieldHarmonization {
  sourceField: ResonanceField;
  targetState: ConsciousnessState;
  harmonizationFactor: number;
  alignmentStrength: number;
  resonantFrequencies: number[];
  stabilityIndex: number;
}

export class ResonanceField extends EventEmitter {
  private sacredFrequencies: Record<SpiritualDomain, FrequencyPattern[]>;
  private activeFields: Map<string, ResonanceField>;
  private harmonizationHistory: FieldHarmonization[];
  private readonly GOLDEN_RATIO = 1.618033988749;
  private readonly SCHUMANN_RESONANCE = 7.83; // Hz
  private readonly OM_FREQUENCY = 136.1; // Hz

  constructor() {
    super();
    this.activeFields = new Map();
    this.harmonizationHistory = [];
    this.sacredFrequencies = this.initializeSacredFrequencies();
  }

  private initializeSacredFrequencies(): Record<SpiritualDomain, FrequencyPattern[]> {
    return {
      [SpiritualDomain.WISDOM]: [
        {
          name: 'Divine Wisdom Resonance',
          baseFrequency: 741, // Solfeggio frequency for awakening intuition
          harmonics: [741, 1482, 2223, 2964],
          spiritualDomain: SpiritualDomain.WISDOM,
          consciousnessResonance: 0.85,
          description: 'Frequency pattern that awakens inner wisdom and divine knowledge'
        },
        {
          name: 'Sacred Knowledge Field',
          baseFrequency: 963, // Solfeggio frequency for higher consciousness
          harmonics: [963, 1926, 2889],
          spiritualDomain: SpiritualDomain.WISDOM,
          consciousnessResonance: 0.92,
          description: 'High-frequency pattern for accessing sacred knowledge'
        }
      ],
      [SpiritualDomain.LOVE]: [
        {
          name: 'Heart Chakra Resonance',
          baseFrequency: 528, // Love frequency
          harmonics: [528, 1056, 1584, 2112],
          spiritualDomain: SpiritualDomain.LOVE,
          consciousnessResonance: 0.88,
          description: 'The frequency of love, healing, and DNA repair'
        },
        {
          name: 'Compassionate Heart Field',
          baseFrequency: 341.3, // Heart chakra tone
          harmonics: [341.3, 682.6, 1023.9],
          spiritualDomain: SpiritualDomain.LOVE,
          consciousnessResonance: 0.82,
          description: 'Frequency that opens the heart to universal love'
        }
      ],
      [SpiritualDomain.HEALING]: [
        {
          name: 'Healing Light Resonance',
          baseFrequency: 285, // Solfeggio healing frequency
          harmonics: [285, 570, 855, 1140],
          spiritualDomain: SpiritualDomain.HEALING,
          consciousnessResonance: 0.79,
          description: 'Frequency pattern for cellular healing and regeneration'
        },
        {
          name: 'Divine Restoration Field',
          baseFrequency: 417, // Facilitating change and healing
          harmonics: [417, 834, 1251],
          spiritualDomain: SpiritualDomain.HEALING,
          consciousnessResonance: 0.86,
          description: 'Frequency that facilitates healing and positive change'
        }
      ],
      [SpiritualDomain.PURPOSE]: [
        {
          name: 'Life Purpose Resonance',
          baseFrequency: 396, // Liberating guilt and fear
          harmonics: [396, 792, 1188, 1584],
          spiritualDomain: SpiritualDomain.PURPOSE,
          consciousnessResonance: 0.81,
          description: 'Frequency that helps identify and align with life purpose'
        },
        {
          name: 'Soul Mission Activation',
          baseFrequency: 852, // Returning to spiritual order
          harmonics: [852, 1704, 2556],
          spiritualDomain: SpiritualDomain.PURPOSE,
          consciousnessResonance: 0.89,
          description: 'High-frequency pattern for soul mission activation'
        }
      ],
      [SpiritualDomain.PROTECTION]: [
        {
          name: 'Spiritual Shield Resonance',
          baseFrequency: this.SCHUMANN_RESONANCE,
          harmonics: [7.83, 15.66, 23.49, 31.32],
          spiritualDomain: SpiritualDomain.PROTECTION,
          consciousnessResonance: 0.77,
          description: 'Earth resonance frequency for grounding and protection'
        },
        {
          name: 'Divine Protection Field',
          baseFrequency: 174, // Pain relief and security
          harmonics: [174, 348, 522, 696],
          spiritualDomain: SpiritualDomain.PROTECTION,
          consciousnessResonance: 0.84,
          description: 'Low-frequency pattern for spiritual protection and security'
        }
      ],
      [SpiritualDomain.MANIFESTATION]: [
        {
          name: 'Manifestation Resonance',
          baseFrequency: 639, // Connecting/relationships
          harmonics: [639, 1278, 1917, 2556],
          spiritualDomain: SpiritualDomain.MANIFESTATION,
          consciousnessResonance: 0.83,
          description: 'Frequency for harmonious relationships and manifestation'
        },
        {
          name: 'Creative Power Field',
          baseFrequency: this.OM_FREQUENCY,
          harmonics: [136.1, 272.2, 408.3, 544.4],
          spiritualDomain: SpiritualDomain.MANIFESTATION,
          consciousnessResonance: 0.91,
          description: 'OM frequency for creative manifestation and cosmic connection'
        }
      ],
      [SpiritualDomain.TRANSFORMATION]: [
        {
          name: 'Transformation Catalyst',
          baseFrequency: 444, // Cellular transformation
          harmonics: [444, 888, 1332, 1776],
          spiritualDomain: SpiritualDomain.TRANSFORMATION,
          consciousnessResonance: 0.87,
          description: 'Frequency that catalyzes spiritual transformation'
        },
        {
          name: 'Rebirth Resonance',
          baseFrequency: 888, // Infinite abundance and transformation
          harmonics: [888, 1776, 2664],
          spiritualDomain: SpiritualDomain.TRANSFORMATION,
          consciousnessResonance: 0.93,
          description: 'High-frequency pattern for spiritual rebirth and renewal'
        }
      ]
    };
  }

  public async updateConsciousness(consciousnessState: ConsciousnessState): Promise<void> {
    // Calculate resonant frequency based on consciousness state
    const resonantFreq = this.calculateConsciousnessFrequency(consciousnessState);
    
    // Create resonance field for the consciousness state
    const field = await this.createConsciousnessField(consciousnessState, resonantFreq);
    
    this.emit('consciousnessFieldUpdated', { consciousnessState, field });
  }

  public async calculateGuidanceResonance(
    domain: SpiritualDomain, 
    consciousnessState: ConsciousnessState
  ): Promise<number> {
    const domainPatterns = this.sacredFrequencies[domain];
    
    // Select the most resonant pattern based on consciousness state
    const selectedPattern = this.selectOptimalPattern(domainPatterns, consciousnessState);
    
    // Calculate resonance strength
    const resonanceStrength = selectedPattern.consciousnessResonance * 
                             consciousnessState.spiritualResonance;
    
    // Apply golden ratio harmonization
    const harmonizedFrequency = selectedPattern.baseFrequency * 
                               Math.pow(this.GOLDEN_RATIO, resonanceStrength);
    
    return harmonizedFrequency;
  }

  public async createMeditationField(
    intention: string, 
    durationMinutes: number
  ): Promise<ResonanceField> {
    const fieldId = `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine primary frequency based on intention
    const primaryFreq = this.determineIntentionFrequency(intention);
    
    // Generate harmonic series
    const harmonics = this.generateHarmonicSeries(primaryFreq, 5);
    
    // Create frequency patterns for the field
    const patterns: FrequencyPattern[] = harmonics.map((freq, index) => ({
      name: `Meditation Harmonic ${index + 1}`,
      baseFrequency: freq,
      harmonics: [freq, freq * 2, freq * 3],
      spiritualDomain: this.determineFrequencyDomain(freq),
      consciousnessResonance: 0.8 - (index * 0.1),
      description: `Harmonic frequency for meditation intention: ${intention}`
    }));

    const field: ResonanceField = {
      fieldId,
      centerFrequency: primaryFreq,
      amplitude: this.calculateOptimalAmplitude(durationMinutes),
      coherence: 0.9, // High coherence for meditation
      patterns,
      timestamp: new Date(),
      duration: durationMinutes,
      intention
    };

    this.activeFields.set(fieldId, field);
    this.emit('meditationFieldCreated', field);
    
    return field;
  }

  private calculateConsciousnessFrequency(consciousnessState: ConsciousnessState): number {
    // Base frequency calculation using consciousness metrics
    const baseFreq = 40 + (consciousnessState.spiritualResonance * 200); // 40-240 Hz range
    
    // Apply level-specific multipliers
    const levelMultipliers = {
      awakening: 1.0,
      expanding: 1.2,
      transcending: 1.5,
      enlightened: 1.8,
      divine_unity: 2.1
    };
    
    const multiplier = levelMultipliers[consciousnessState.level] || 1.0;
    
    // Apply golden ratio harmonization
    return baseFreq * multiplier * this.GOLDEN_RATIO;
  }

  private async createConsciousnessField(
    consciousnessState: ConsciousnessState, 
    centerFreq: number
  ): Promise<ResonanceField> {
    const fieldId = `consciousness_${Date.now()}`;
    
    // Generate patterns based on consciousness state
    const patterns = this.generateConsciousnessPatterns(consciousnessState, centerFreq);
    
    const field: ResonanceField = {
      fieldId,
      centerFrequency: centerFreq,
      amplitude: consciousnessState.spiritualResonance,
      coherence: (consciousnessState.clarity + consciousnessState.mentalPeace) / 2,
      patterns,
      timestamp: new Date(),
      duration: 0 // Continuous field
    };

    this.activeFields.set(fieldId, field);
    return field;
  }

  private selectOptimalPattern(
    patterns: FrequencyPattern[], 
    consciousnessState: ConsciousnessState
  ): FrequencyPattern {
    // Score each pattern based on consciousness resonance
    const scoredPatterns = patterns.map(pattern => ({
      pattern,
      score: pattern.consciousnessResonance * consciousnessState.spiritualResonance
    }));

    // Sort by score and return the highest
    scoredPatterns.sort((a, b) => b.score - a.score);
    return scoredPatterns[0].pattern;
  }

  private determineIntentionFrequency(intention: string): number {
    const intentionKeywords = {
      love: 528,
      healing: 417,
      wisdom: 741,
      peace: this.SCHUMANN_RESONANCE,
      transformation: 444,
      protection: 174,
      manifestation: 639,
      unity: this.OM_FREQUENCY
    };

    const lowerIntention = intention.toLowerCase();
    
    for (const [keyword, frequency] of Object.entries(intentionKeywords)) {
      if (lowerIntention.includes(keyword)) {
        return frequency;
      }
    }

    // Default to OM frequency for general meditation
    return this.OM_FREQUENCY;
  }

  private generateHarmonicSeries(baseFreq: number, count: number): number[] {
    const harmonics: number[] = [baseFreq];
    
    for (let i = 1; i < count; i++) {
      // Use golden ratio for harmonic generation
      const harmonic = baseFreq * Math.pow(this.GOLDEN_RATIO, i);
      harmonics.push(harmonic);
    }
    
    return harmonics;
  }

  private determineFrequencyDomain(frequency: number): SpiritualDomain {
    // Map frequency ranges to spiritual domains
    if (frequency <= 200) return SpiritualDomain.PROTECTION;
    if (frequency <= 400) return SpiritualDomain.HEALING;
    if (frequency <= 600) return SpiritualDomain.LOVE;
    if (frequency <= 700) return SpiritualDomain.MANIFESTATION;
    if (frequency <= 800) return SpiritualDomain.WISDOM;
    if (frequency <= 900) return SpiritualDomain.PURPOSE;
    return SpiritualDomain.TRANSFORMATION;
  }

  private calculateOptimalAmplitude(durationMinutes: number): number {
    // Amplitude increases with duration but caps at 1.0
    const baseAmplitude = 0.5;
    const durationFactor = Math.min(1.0, durationMinutes / 60); // Normalize to 1 hour
    return Math.min(1.0, baseAmplitude + (durationFactor * 0.5));
  }

  private generateConsciousnessPatterns(
    consciousnessState: ConsciousnessState, 
    centerFreq: number
  ): FrequencyPattern[] {
    const patterns: FrequencyPattern[] = [];
    
    // Generate patterns for each consciousness aspect
    const aspects = [
      { name: 'Clarity', value: consciousnessState.clarity, domain: SpiritualDomain.WISDOM },
      { name: 'Spiritual Resonance', value: consciousnessState.spiritualResonance, domain: SpiritualDomain.LOVE },
      { name: 'Divine Connection', value: consciousnessState.divineConnection, domain: SpiritualDomain.PURPOSE },
      { name: 'Emotional Balance', value: consciousnessState.emotionalBalance, domain: SpiritualDomain.HEALING },
      { name: 'Mental Peace', value: consciousnessState.mentalPeace, domain: SpiritualDomain.PROTECTION }
    ];

    aspects.forEach((aspect, index) => {
      const patternFreq = centerFreq * (1 + (aspect.value * 0.3));
      patterns.push({
        name: `${aspect.name} Resonance Pattern`,
        baseFrequency: patternFreq,
        harmonics: this.generateHarmonicSeries(patternFreq, 3),
        spiritualDomain: aspect.domain,
        consciousnessResonance: aspect.value,
        description: `Frequency pattern for ${aspect.name.toLowerCase()} enhancement`
      });
    });

    return patterns;
  }

  public async harmonizeFields(
    sourceFieldId: string, 
    targetState: ConsciousnessState
  ): Promise<FieldHarmonization> {
    const sourceField = this.activeFields.get(sourceFieldId);
    if (!sourceField) {
      throw new Error(`Source field ${sourceFieldId} not found`);
    }

    // Calculate harmonization parameters
    const harmonizationFactor = this.calculateHarmonizationFactor(sourceField, targetState);
    const alignmentStrength = this.calculateAlignmentStrength(sourceField, targetState);
    const resonantFrequencies = this.findResonantFrequencies(sourceField, targetState);
    const stabilityIndex = this.calculateStabilityIndex(harmonizationFactor, alignmentStrength);

    const harmonization: FieldHarmonization = {
      sourceField,
      targetState,
      harmonizationFactor,
      alignmentStrength,
      resonantFrequencies,
      stabilityIndex
    };

    this.harmonizationHistory.push(harmonization);
    this.emit('fieldHarmonized', harmonization);

    return harmonization;
  }

  private calculateHarmonizationFactor(field: ResonanceField, state: ConsciousnessState): number {
    // Calculate how well the field harmonizes with the consciousness state
    const fieldCoherence = field.coherence;
    const stateCoherence = (state.clarity + state.mentalPeace) / 2;
    return (fieldCoherence + stateCoherence) / 2;
  }

  private calculateAlignmentStrength(field: ResonanceField, state: ConsciousnessState): number {
    // Calculate alignment strength based on frequency matching
    const targetFreq = this.calculateConsciousnessFrequency(state);
    const frequencyAlignment = 1 - Math.abs(field.centerFrequency - targetFreq) / Math.max(field.centerFrequency, targetFreq);
    return Math.max(0, frequencyAlignment);
  }

  private findResonantFrequencies(field: ResonanceField, state: ConsciousnessState): number[] {
    const resonantFreqs: number[] = [];
    const targetFreq = this.calculateConsciousnessFrequency(state);
    
    // Find field frequencies that resonate with the target
    field.patterns.forEach(pattern => {
      pattern.harmonics.forEach(harmonic => {
        const resonanceRatio = harmonic / targetFreq;
        // Check for simple ratio resonance (1:1, 2:1, 3:2, etc.)
        if (this.isResonantRatio(resonanceRatio)) {
          resonantFreqs.push(harmonic);
        }
      });
    });

    return resonantFreqs;
  }

  private isResonantRatio(ratio: number): boolean {
    // Check if ratio is close to simple harmonic ratios
    const simpleRatios = [1, 2, 3/2, 4/3, 5/4, this.GOLDEN_RATIO];
    return simpleRatios.some(simpleRatio => 
      Math.abs(ratio - simpleRatio) < 0.1 || 
      Math.abs(ratio - 1/simpleRatio) < 0.1
    );
  }

  private calculateStabilityIndex(harmonizationFactor: number, alignmentStrength: number): number {
    // Stability is based on both harmonization and alignment
    return (harmonizationFactor * 0.6) + (alignmentStrength * 0.4);
  }

  public getActiveFields(): ResonanceField[] {
    return Array.from(this.activeFields.values());
  }

  public getFieldHistory(): FieldHarmonization[] {
    return [...this.harmonizationHistory];
  }

  public clearInactiveFields(): void {
    const now = new Date();
    for (const [fieldId, field] of this.activeFields.entries()) {
      if (field.duration > 0) {
        const fieldAge = (now.getTime() - field.timestamp.getTime()) / (1000 * 60); // minutes
        if (fieldAge > field.duration) {
          this.activeFields.delete(fieldId);
          this.emit('fieldExpired', field);
        }
      }
    }
  }
}