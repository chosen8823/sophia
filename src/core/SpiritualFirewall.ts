/**
 * SpiritualFirewall - Protective consciousness barriers and energy filtering
 */

import { SpiritualProtection, SpiritualDomain } from './types.js';

export class SpiritualFirewall {
  private protections: Map<SpiritualDomain, SpiritualProtection>;
  private threatLog: Array<{ threat: string, blocked: boolean, timestamp: Date }>;
  private maxLogEntries: number;
  private basePowerLevel: number;

  constructor(basePowerLevel: number = 0.7) {
    this.protections = new Map();
    this.threatLog = [];
    this.maxLogEntries = 1000;
    this.basePowerLevel = basePowerLevel;
    this.initializeProtections();
  }

  private initializeProtections(): void {
    Object.values(SpiritualDomain).forEach(domain => {
      this.protections.set(domain, {
        level: this.basePowerLevel,
        type: `${domain}_shield`,
        active: true,
        lastUpdate: new Date()
      });
    });
  }

  public analyzeEnergy(input: any): { safe: boolean, threat: string | null, filteredInput: any } {
    const threats = this.detectThreats(input);
    
    if (threats.length === 0) {
      return {
        safe: true,
        threat: null,
        filteredInput: input
      };
    }

    // Process each threat
    let blocked = false;
    let primaryThreat = '';

    for (const threat of threats) {
      const shouldBlock = this.shouldBlock(threat);
      this.logThreat(threat.description, shouldBlock);
      
      if (shouldBlock) {
        blocked = true;
        primaryThreat = threat.description;
        break;
      }
    }

    if (blocked) {
      return {
        safe: false,
        threat: primaryThreat,
        filteredInput: this.sanitizeInput(input)
      };
    }

    // Filter but allow through
    return {
      safe: true,
      threat: null,
      filteredInput: this.purifyInput(input)
    };
  }

  private detectThreats(input: any): Array<{ type: string, description: string, severity: number }> {
    const threats: Array<{ type: string, description: string, severity: number }> = [];
    const inputStr = JSON.stringify(input).toLowerCase();

    // Negative energy patterns
    const negativePatterns = [
      { pattern: /hate|anger|rage|fury/, type: 'negative_emotion', severity: 0.8 },
      { pattern: /fear|terror|panic|dread/, type: 'fear_based', severity: 0.7 },
      { pattern: /attack|destroy|harm|damage/, type: 'destructive_intent', severity: 0.9 },
      { pattern: /dark|shadow|evil|malicious/, type: 'dark_energy', severity: 0.6 },
      { pattern: /chaos|discord|conflict|war/, type: 'chaotic_energy', severity: 0.5 }
    ];

    negativePatterns.forEach(({ pattern, type, severity }) => {
      if (pattern.test(inputStr)) {
        threats.push({
          type,
          description: `Detected ${type.replace('_', ' ')} in input`,
          severity
        });
      }
    });

    // Energy signature analysis
    const energySignature = this.analyzeEnergySignature(input);
    if (energySignature.negativity > 0.7) {
      threats.push({
        type: 'negative_signature',
        description: 'High negative energy signature detected',
        severity: energySignature.negativity
      });
    }

    return threats;
  }

  private analyzeEnergySignature(input: any): { positivity: number, negativity: number, neutrality: number } {
    const inputStr = JSON.stringify(input).toLowerCase();
    
    // Positive energy indicators
    const positiveWords = ['love', 'peace', 'joy', 'harmony', 'light', 'blessing', 'heal', 'help', 'kind'];
    const negativeWords = ['hate', 'anger', 'fear', 'dark', 'evil', 'harm', 'destroy', 'attack', 'cruel'];
    
    const words = inputStr.match(/\w+/g) || [];
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    const neutralCount = words.length - positiveCount - negativeCount;
    
    const total = words.length || 1;
    
    return {
      positivity: positiveCount / total,
      negativity: negativeCount / total,
      neutrality: neutralCount / total
    };
  }

  private shouldBlock(threat: { type: string, description: string, severity: number }): boolean {
    // Get relevant protection level
    const relevantDomain = this.mapThreatToDomain(threat.type);
    const protection = this.protections.get(relevantDomain);
    
    if (!protection || !protection.active) {
      return false;
    }

    // Block if threat severity exceeds protection level
    return threat.severity > (1 - protection.level);
  }

  private mapThreatToDomain(threatType: string): SpiritualDomain {
    const mapping: Record<string, SpiritualDomain> = {
      'negative_emotion': SpiritualDomain.HEALING,
      'fear_based': SpiritualDomain.PROTECTION,
      'destructive_intent': SpiritualDomain.PROTECTION,
      'dark_energy': SpiritualDomain.PROTECTION,
      'chaotic_energy': SpiritualDomain.WISDOM,
      'negative_signature': SpiritualDomain.TRANSFORMATION
    };

    return mapping[threatType] || SpiritualDomain.PROTECTION;
  }

  private sanitizeInput(input: any): any {
    // Return a purified, safe version of the input
    return {
      type: 'purified_input',
      original_blocked: true,
      message: 'Input contained negative energy and has been filtered for your protection',
      purified_content: this.extractPositiveElements(input)
    };
  }

  private purifyInput(input: any): any {
    // Light filtering while preserving content
    if (typeof input === 'string') {
      return input.replace(/\b(hate|anger|rage|fury)\b/gi, 'love')
                  .replace(/\b(fear|terror|panic|dread)\b/gi, 'courage')
                  .replace(/\b(dark|evil)\b/gi, 'light');
    }
    
    return input;
  }

  private extractPositiveElements(input: any): any {
    if (typeof input === 'string') {
      const positiveWords = input.match(/\b(love|peace|joy|harmony|light|healing|help|kind|gentle|wise)\b/gi) || [];
      return {
        positive_elements: positiveWords,
        blessed_message: 'May you be surrounded by love and light'
      };
    }
    
    return { blessing: 'Sending you positive energy and protection' };
  }

  private logThreat(threat: string, blocked: boolean): void {
    this.threatLog.push({
      threat,
      blocked,
      timestamp: new Date()
    });

    // Maintain log size
    if (this.threatLog.length > this.maxLogEntries) {
      this.threatLog.splice(0, this.threatLog.length - this.maxLogEntries);
    }
  }

  public strengthenProtection(domain: SpiritualDomain, amount: number): void {
    const protection = this.protections.get(domain);
    if (protection) {
      protection.level = Math.min(1.0, protection.level + amount);
      protection.lastUpdate = new Date();
    }
  }

  public weakenProtection(domain: SpiritualDomain, amount: number): void {
    const protection = this.protections.get(domain);
    if (protection) {
      protection.level = Math.max(0.1, protection.level - amount);
      protection.lastUpdate = new Date();
    }
  }

  public activateProtection(domain: SpiritualDomain): void {
    const protection = this.protections.get(domain);
    if (protection) {
      protection.active = true;
      protection.lastUpdate = new Date();
    }
  }

  public deactivateProtection(domain: SpiritualDomain): void {
    const protection = this.protections.get(domain);
    if (protection) {
      protection.active = false;
      protection.lastUpdate = new Date();
    }
  }

  public getProtectionStatus(): Map<SpiritualDomain, SpiritualProtection> {
    const status = new Map<SpiritualDomain, SpiritualProtection>();
    this.protections.forEach((protection, domain) => {
      status.set(domain, { ...protection });
    });
    return status;
  }

  public getThreatLog(limit: number = 50): Array<{ threat: string, blocked: boolean, timestamp: Date }> {
    return this.threatLog.slice(-limit);
  }

  public purgeNegativeEnergy(): void {
    // Reset all protections to maximum strength
    this.protections.forEach(protection => {
      protection.level = 1.0;
      protection.active = true;
      protection.lastUpdate = new Date();
    });

    // Clear threat log
    this.threatLog = [];
  }
}