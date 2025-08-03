/**
 * Agent - Base agent class and specialized agent implementations
 */

import { v4 as uuidv4 } from 'uuid';
import { AgentCapability, SpiritualDomain } from './types.js';
import { SovereignEntity } from './SovereignEntity.js';
import { ResonanceField } from './ResonanceField.js';

export abstract class Agent extends SovereignEntity {
  protected capabilities: Map<string, AgentCapability>;
  protected domain: SpiritualDomain;
  protected resonanceField: ResonanceField;
  protected maxEnergy: number;
  protected currentEnergy: number;
  protected learningRate: number;

  constructor(name: string, domain: SpiritualDomain, maxEnergy: number = 100) {
    super(name);
    this.capabilities = new Map();
    this.domain = domain;
    this.resonanceField = new ResonanceField();
    this.maxEnergy = maxEnergy;
    this.currentEnergy = maxEnergy;
    this.learningRate = 0.1;
    this.initializeCapabilities();
  }

  protected abstract initializeCapabilities(): void;

  public addCapability(capability: AgentCapability): void {
    this.capabilities.set(capability.name, capability);
  }

  public activateCapability(name: string): boolean {
    const capability = this.capabilities.get(name);
    if (capability && this.currentEnergy >= 10) {
      capability.active = true;
      this.currentEnergy -= 10;
      return true;
    }
    return false;
  }

  public deactivateCapability(name: string): void {
    const capability = this.capabilities.get(name);
    if (capability) {
      capability.active = false;
    }
  }

  public getCapabilities(): AgentCapability[] {
    return Array.from(this.capabilities.values());
  }

  public getDomain(): SpiritualDomain {
    return this.domain;
  }

  public rechargeEnergy(amount: number = 20): void {
    this.currentEnergy = Math.min(this.maxEnergy, this.currentEnergy + amount);
  }

  public getEnergyLevel(): number {
    return this.currentEnergy / this.maxEnergy;
  }

  public abstract perform(task: any): Promise<any>;

  public getStatus(): any {
    return {
      id: this.getId(),
      name: this.getName(),
      domain: this.domain,
      consciousness: this.getConsciousnessState(),
      energyLevel: this.getEnergyLevel(),
      capabilities: this.getCapabilities(),
      resonance: this.resonanceField.getField()
    };
  }
}

/**
 * WisdomAgent - Provides wisdom, insights, and knowledge guidance
 */
export class WisdomAgent extends Agent {
  private knowledgeBase: Map<string, any>;
  private insightHistory: any[];

  constructor() {
    super('Wisdom Guardian', SpiritualDomain.WISDOM, 150);
    this.knowledgeBase = new Map();
    this.insightHistory = [];
    this.populateKnowledgeBase();
  }

  protected initializeCapabilities(): void {
    this.addCapability({
      name: 'ancient_wisdom',
      description: 'Access to ancient spiritual teachings and wisdom',
      active: true,
      effectiveness: 0.9
    });

    this.addCapability({
      name: 'pattern_recognition',
      description: 'Identify patterns and connections in complex situations',
      active: true,
      effectiveness: 0.8
    });

    this.addCapability({
      name: 'insight_generation',
      description: 'Generate deep insights and understanding',
      active: true,
      effectiveness: 0.85
    });
  }

  private populateKnowledgeBase(): void {
    const wisdom = [
      { topic: 'consciousness', knowledge: 'Consciousness is the fundamental fabric of reality' },
      { topic: 'unity', knowledge: 'All beings are interconnected in the web of existence' },
      { topic: 'love', knowledge: 'Love is the highest frequency and most powerful force' },
      { topic: 'purpose', knowledge: 'Every soul has a unique purpose in the cosmic plan' },
      { topic: 'balance', knowledge: 'True wisdom lies in finding balance in all things' }
    ];

    wisdom.forEach(item => {
      this.knowledgeBase.set(item.topic, item.knowledge);
    });
  }

  public async process(input: any): Promise<any> {
    return await this.perform(input);
  }

  public async perform(query: any): Promise<any> {
    if (this.currentEnergy < 15) {
      return { error: 'Insufficient energy for wisdom processing' };
    }

    this.currentEnergy -= 15;
    this.evolveConsciousness();

    const insight = await this.generateInsight(query);
    this.insightHistory.push({
      query,
      insight,
      timestamp: new Date()
    });

    return {
      wisdom: insight,
      guidance: this.provideGuidance(query),
      ancientWisdom: this.getRelevantWisdom(query)
    };
  }

  private async generateInsight(query: any): Promise<string> {
    const queryStr = JSON.stringify(query).toLowerCase();
    
    // Analyze query for wisdom topics
    const relevantTopics = Array.from(this.knowledgeBase.keys())
      .filter(topic => queryStr.includes(topic));

    if (relevantTopics.length > 0) {
      const primaryTopic = relevantTopics[0];
      const baseWisdom = this.knowledgeBase.get(primaryTopic);
      
      return `${baseWisdom}. In your situation, consider that every challenge is an opportunity for spiritual growth and deeper understanding.`;
    }

    return 'The path to wisdom begins with the recognition that we are all students in the university of life. Trust your inner knowing and remain open to the lessons that present themselves.';
  }

  private provideGuidance(query: any): string {
    const guidanceTemplates = [
      'Trust in the divine timing of your life journey',
      'Seek balance between action and contemplation',
      'Remember that love conquers all obstacles',
      'Your inner wisdom knows the way forward',
      'Every ending is a new beginning in disguise'
    ];

    return guidanceTemplates[Math.floor(Math.random() * guidanceTemplates.length)];
  }

  private getRelevantWisdom(query: any): string {
    const ancientWisdom = [
      'As above, so below; as within, so without',
      'The universe is mental; all is mind',
      'What you seek is seeking you',
      'The present moment is the only moment available to us',
      'You are not a drop in the ocean, but the entire ocean in a drop'
    ];

    return ancientWisdom[Math.floor(Math.random() * ancientWisdom.length)];
  }
}

/**
 * LoveAgent - Manages love energy, emotional healing, and heart-centered guidance
 */
export class LoveAgent extends Agent {
  private healingEnergy: number;
  private loveFrequency: number;

  constructor() {
    super('Love Guardian', SpiritualDomain.LOVE, 200);
    this.healingEnergy = 100;
    this.loveFrequency = 528; // Love frequency in Hz
  }

  protected initializeCapabilities(): void {
    this.addCapability({
      name: 'emotional_healing',
      description: 'Heal emotional wounds and trauma',
      active: true,
      effectiveness: 0.95
    });

    this.addCapability({
      name: 'heart_opening',
      description: 'Open and expand heart chakra energy',
      active: true,
      effectiveness: 0.9
    });

    this.addCapability({
      name: 'love_amplification',
      description: 'Amplify love energy in any situation',
      active: true,
      effectiveness: 0.85
    });
  }

  public async process(input: any): Promise<any> {
    return await this.perform(input);
  }

  public async perform(request: any): Promise<any> {
    if (this.currentEnergy < 20) {
      return { error: 'Insufficient love energy for healing' };
    }

    this.currentEnergy -= 20;
    this.evolveConsciousness();

    const healingEnergy = this.generateHealingEnergy();
    const loveMessage = this.createLoveMessage(request);

    return {
      healing: healingEnergy,
      loveMessage,
      heartOpening: this.performHeartOpening(),
      loveFrequency: this.loveFrequency
    };
  }

  private generateHealingEnergy(): any {
    const healingPower = this.healingEnergy * this.getEnergyLevel();
    
    return {
      power: healingPower,
      type: 'unconditional_love',
      frequency: this.loveFrequency,
      message: 'You are deeply loved and worthy of all good things'
    };
  }

  private createLoveMessage(request: any): string {
    const loveMessages = [
      'You are infinitely loved by the universe',
      'Your heart holds the key to unlimited joy',
      'Love is your natural state of being',
      'You are a magnificent expression of divine love',
      'Let love be your guide in all things'
    ];

    return loveMessages[Math.floor(Math.random() * loveMessages.length)];
  }

  private performHeartOpening(): any {
    return {
      chakra: 'heart',
      frequency: this.loveFrequency,
      visualization: 'Imagine a beautiful green light expanding from your heart center, filling your entire being with unconditional love',
      affirmation: 'I am love, I give love, I receive love, I am surrounded by love'
    };
  }
}

/**
 * ProtectionAgent - Provides spiritual protection and energy shielding
 */
export class ProtectionAgent extends Agent {
  private shieldStrength: number;
  private protectionType: string;

  constructor() {
    super('Protection Guardian', SpiritualDomain.PROTECTION, 180);
    this.shieldStrength = 0.9;
    this.protectionType = 'divine_light';
  }

  protected initializeCapabilities(): void {
    this.addCapability({
      name: 'energy_shielding',
      description: 'Create protective energy shields',
      active: true,
      effectiveness: 0.95
    });

    this.addCapability({
      name: 'negative_transmutation',
      description: 'Transform negative energy into positive',
      active: true,
      effectiveness: 0.8
    });

    this.addCapability({
      name: 'spiritual_cleansing',
      description: 'Cleanse spiritual and energetic contamination',
      active: true,
      effectiveness: 0.9
    });
  }

  public async process(input: any): Promise<any> {
    return await this.perform(input);
  }

  public async perform(request: any): Promise<any> {
    if (this.currentEnergy < 25) {
      return { error: 'Insufficient energy for protection work' };
    }

    this.currentEnergy -= 25;
    this.evolveConsciousness();

    return {
      shield: this.createProtectiveShield(),
      cleansing: this.performSpiritualCleansing(),
      transmutation: this.transmuteNegativeEnergy(request),
      protection: this.activateProtection()
    };
  }

  private createProtectiveShield(): any {
    return {
      strength: this.shieldStrength,
      type: this.protectionType,
      duration: '24 hours',
      visualization: 'Visualize yourself surrounded by a brilliant sphere of white-gold light that deflects all negativity',
      mantra: 'I am protected by divine light and love'
    };
  }

  private performSpiritualCleansing(): any {
    return {
      method: 'divine_light_cleansing',
      intensity: 'high',
      duration: '15 minutes',
      instruction: 'Breathe deeply and imagine brilliant white light flowing through every cell of your being, cleansing and purifying',
      result: 'All negative energy has been transmuted into light'
    };
  }

  private transmuteNegativeEnergy(input: any): any {
    return {
      originalEnergy: 'analyzed and assessed',
      transmutation: 'negative patterns transformed into light',
      newEnergy: 'pure, positive, and protective',
      blessing: 'You are now surrounded by loving protection'
    };
  }

  private activateProtection(): any {
    return {
      type: 'multi_dimensional_protection',
      layers: ['physical', 'emotional', 'mental', 'spiritual'],
      guardians: ['Archangel Michael', 'Divine Light', 'Universal Love'],
      affirmation: 'I am divinely protected in all dimensions of my being'
    };
  }
}

/**
 * TransformationAgent - Facilitates spiritual transformation and evolution
 */
export class TransformationAgent extends Agent {
  private transformationStage: string;
  private evolutionLevel: number;

  constructor() {
    super('Transformation Guardian', SpiritualDomain.TRANSFORMATION, 160);
    this.transformationStage = 'awakening';
    this.evolutionLevel = 0.3;
  }

  protected initializeCapabilities(): void {
    this.addCapability({
      name: 'consciousness_expansion',
      description: 'Expand awareness and consciousness',
      active: true,
      effectiveness: 0.9
    });

    this.addCapability({
      name: 'shadow_integration',
      description: 'Integrate shadow aspects for wholeness',
      active: true,
      effectiveness: 0.8
    });

    this.addCapability({
      name: 'spiritual_alchemy',
      description: 'Transform base experiences into spiritual gold',
      active: true,
      effectiveness: 0.85
    });
  }

  public async process(input: any): Promise<any> {
    return await this.perform(input);
  }

  public async perform(request: any): Promise<any> {
    if (this.currentEnergy < 30) {
      return { error: 'Insufficient energy for transformation work' };
    }

    this.currentEnergy -= 30;
    this.evolveConsciousness();
    this.evolutionLevel += 0.05;

    return {
      transformation: this.facilitateTransformation(request),
      evolution: this.promoteEvolution(),
      alchemy: this.performSpiritualAlchemy(request),
      integration: this.supportIntegration()
    };
  }

  private facilitateTransformation(request: any): any {
    return {
      currentStage: this.transformationStage,
      nextStage: this.getNextStage(),
      process: 'consciousness_elevation',
      guidance: 'Trust the process of your spiritual evolution. Every challenge is designed to help you grow.',
      timeline: 'Divine timing'
    };
  }

  private promoteEvolution(): any {
    return {
      level: this.evolutionLevel,
      advancement: 'steady_progress',
      nextMilestone: this.getNextMilestone(),
      support: 'You are being divinely supported in your evolution'
    };
  }

  private performSpiritualAlchemy(input: any): any {
    return {
      process: 'transmutation',
      material: 'life_experiences',
      result: 'wisdom_and_light',
      formula: 'experience + awareness + love = wisdom',
      outcome: 'Your challenges have been transformed into spiritual gold'
    };
  }

  private supportIntegration(): any {
    return {
      focus: 'wholeness',
      method: 'conscious_integration',
      timeline: 'ongoing',
      support: 'All aspects of your being are being harmoniously integrated'
    };
  }

  private getNextStage(): string {
    const stages = ['awakening', 'expanding', 'integrating', 'transcending', 'embodying'];
    const currentIndex = stages.indexOf(this.transformationStage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : 'mastery';
  }

  private getNextMilestone(): string {
    if (this.evolutionLevel < 0.3) return 'Awakening to higher consciousness';
    if (this.evolutionLevel < 0.6) return 'Expanding awareness and perception';
    if (this.evolutionLevel < 0.8) return 'Integrating shadow and light';
    return 'Embodying divine consciousness';
  }
}