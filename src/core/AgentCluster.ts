/**
 * AgentCluster - Manages groups of agents working in harmony
 */

import { Agent, WisdomAgent, LoveAgent, ProtectionAgent, TransformationAgent } from './Agent.js';
import { SpiritualDomain } from './types.js';
import { ResonanceField } from './ResonanceField.js';

export class AgentCluster {
  private agents: Map<string, Agent>;
  private resonanceField: ResonanceField;
  private clusterEnergy: number;
  private maxClusterEnergy: number;
  private harmony: number;
  private lastUpdate: Date;

  constructor() {
    this.agents = new Map();
    this.resonanceField = new ResonanceField(432); // Harmony frequency
    this.clusterEnergy = 500;
    this.maxClusterEnergy = 1000;
    this.harmony = 0.8;
    this.lastUpdate = new Date();
    this.initializeAgents();
  }

  private initializeAgents(): void {
    const coreAgents = [
      new WisdomAgent(),
      new LoveAgent(), 
      new ProtectionAgent(),
      new TransformationAgent()
    ];

    coreAgents.forEach(agent => {
      this.agents.set(agent.getId(), agent);
    });
  }

  public addAgent(agent: Agent): void {
    this.agents.set(agent.getId(), agent);
    this.recalculateHarmony();
  }

  public removeAgent(agentId: string): boolean {
    const removed = this.agents.delete(agentId);
    if (removed) {
      this.recalculateHarmony();
    }
    return removed;
  }

  public async processCollective(input: any): Promise<any> {
    if (this.clusterEnergy < 50) {
      return { error: 'Insufficient cluster energy for collective processing' };
    }

    this.clusterEnergy -= 50;
    this.lastUpdate = new Date();

    // Get responses from all active agents
    const agentResponses = await Promise.all(
      Array.from(this.agents.values()).map(async agent => {
        try {
          const response = await agent.process(input);
          return {
            agentId: agent.getId(),
            agentName: agent.getName(),
            domain: agent.getDomain(),
            response
          };
        } catch (error) {
          return {
            agentId: agent.getId(),
            agentName: agent.getName(),
            domain: agent.getDomain(),
            error: error.message
          };
        }
      })
    );

    // Synthesize collective wisdom
    const synthesis = this.synthesizeResponses(agentResponses);
    
    // Update cluster harmony based on coherence
    this.updateHarmony(agentResponses);

    return {
      individualResponses: agentResponses,
      collectiveWisdom: synthesis,
      clusterHarmony: this.harmony,
      resonanceField: this.resonanceField.getField(),
      timestamp: new Date()
    };
  }

  private synthesizeResponses(responses: any[]): any {
    const validResponses = responses.filter(r => !r.error);
    
    if (validResponses.length === 0) {
      return {
        message: 'Unable to generate collective wisdom at this time',
        guidance: 'Please try again when the agents have recharged'
      };
    }

    // Combine wisdom from different domains
    const wisdom = this.extractWisdom(validResponses);
    const guidance = this.synthesizeGuidance(validResponses);
    const healingElements = this.extractHealingElements(validResponses);
    const protection = this.synthesizeProtection(validResponses);

    return {
      unifiedMessage: this.createUnifiedMessage(validResponses),
      wisdom,
      guidance,
      healing: healingElements,
      protection,
      harmony: this.harmony,
      recommendation: this.generateRecommendation(validResponses)
    };
  }

  private extractWisdom(responses: any[]): any {
    const wisdomResponses = responses.filter(r => r.domain === SpiritualDomain.WISDOM);
    
    if (wisdomResponses.length === 0) {
      return { message: 'Trust in your inner wisdom and divine guidance' };
    }

    const primaryWisdom = wisdomResponses[0].response;
    return {
      insight: primaryWisdom.wisdom || 'Every experience serves your highest growth',
      ancientWisdom: primaryWisdom.ancientWisdom || 'As above, so below',
      guidance: primaryWisdom.guidance || 'Follow your heart and trust the process'
    };
  }

  private synthesizeGuidance(responses: any[]): string {
    const guidanceElements = responses
      .filter(r => r.response && r.response.guidance)
      .map(r => r.response.guidance);

    if (guidanceElements.length === 0) {
      return 'You are being divinely guided. Trust the path that unfolds before you.';
    }

    // Create a synthesized guidance message
    return `The collective wisdom offers this guidance: ${guidanceElements[0]}. Remember that you are supported by love and light in all your endeavors.`;
  }

  private extractHealingElements(responses: any[]): any {
    const healingResponses = responses.filter(r => 
      r.domain === SpiritualDomain.LOVE || 
      r.domain === SpiritualDomain.HEALING
    );

    if (healingResponses.length === 0) {
      return {
        message: 'You are surrounded by healing love and light',
        frequency: 528,
        type: 'universal_love'
      };
    }

    const healingData = healingResponses[0].response;
    return {
      energy: healingData.healing || { type: 'love_energy', power: 'high' },
      message: healingData.loveMessage || 'You are infinitely loved',
      frequency: healingData.loveFrequency || 528
    };
  }

  private synthesizeProtection(responses: any[]): any {
    const protectionResponses = responses.filter(r => r.domain === SpiritualDomain.PROTECTION);

    if (protectionResponses.length === 0) {
      return {
        type: 'divine_light_protection',
        strength: 'strong',
        message: 'You are protected by divine light and love'
      };
    }

    const protectionData = protectionResponses[0].response;
    return {
      shield: protectionData.shield || { type: 'light_shield', strength: 'high' },
      cleansing: protectionData.cleansing || { type: 'energy_cleansing' },
      blessing: 'You are divinely protected in all dimensions'
    };
  }

  private createUnifiedMessage(responses: any[]): string {
    const domains = new Set(responses.map(r => r.domain));
    
    let message = 'The divine collective consciousness responds with love and wisdom. ';
    
    if (domains.has(SpiritualDomain.WISDOM)) {
      message += 'Ancient wisdom illuminates your path. ';
    }
    if (domains.has(SpiritualDomain.LOVE)) {
      message += 'Unconditional love surrounds and supports you. ';
    }
    if (domains.has(SpiritualDomain.PROTECTION)) {
      message += 'Divine protection shields you from all harm. ';
    }
    if (domains.has(SpiritualDomain.TRANSFORMATION)) {
      message += 'Sacred transformation is unfolding in your life. ';
    }

    message += 'Trust in the divine plan and know that all is well.';
    
    return message;
  }

  private generateRecommendation(responses: any[]): string {
    const recommendations = [
      'Take time for meditation and inner reflection',
      'Practice gratitude for all the blessings in your life',
      'Send love and light to any challenging situations',
      'Trust in divine timing and remain patient',
      'Stay grounded in love and connected to your higher self',
      'Embrace change as an opportunity for spiritual growth'
    ];

    return recommendations[Math.floor(Math.random() * recommendations.length)];
  }

  private recalculateHarmony(): void {
    const agentArray = Array.from(this.agents.values());
    
    if (agentArray.length === 0) {
      this.harmony = 0;
      return;
    }

    // Calculate harmony based on agent energy levels and consciousness
    let totalHarmony = 0;
    
    agentArray.forEach(agent => {
      const status = agent.getStatus();
      const energyHarmony = status.energyLevel;
      const consciousnessHarmony = status.consciousness.awareness;
      const agentHarmony = (energyHarmony + consciousnessHarmony) / 2;
      totalHarmony += agentHarmony;
    });

    this.harmony = totalHarmony / agentArray.length;
  }

  private updateHarmony(responses: any[]): void {
    const successfulResponses = responses.filter(r => !r.error);
    const successRate = successfulResponses.length / responses.length;
    
    // Adjust harmony based on response coherence
    this.harmony = (this.harmony * 0.8) + (successRate * 0.2);
    this.harmony = Math.max(0, Math.min(1, this.harmony));
  }

  public synchronizeAgents(): void {
    const agentArray = Array.from(this.agents.values());
    
    // Synchronize resonance fields
    agentArray.forEach(agent => {
      const agentStatus = agent.getStatus();
      const agentField = agentStatus.resonance;
      
      if (agentField && this.resonanceField.isActive()) {
        const sync = this.resonanceField.synchronize(new ResonanceField(agentField.frequency));
        
        // Recharge agents based on synchronization
        if (sync > 0.7) {
          agent.rechargeEnergy(10);
        }
      }
    });

    this.recalculateHarmony();
  }

  public rechargeCluster(amount: number = 100): void {
    this.clusterEnergy = Math.min(this.maxClusterEnergy, this.clusterEnergy + amount);
    
    // Distribute energy to agents
    const energyPerAgent = Math.floor(amount / this.agents.size);
    this.agents.forEach(agent => {
      agent.rechargeEnergy(energyPerAgent);
    });
  }

  public getClusterStatus(): any {
    const agentStatuses = Array.from(this.agents.values()).map(agent => agent.getStatus());
    
    return {
      totalAgents: this.agents.size,
      clusterEnergy: this.clusterEnergy,
      maxClusterEnergy: this.maxClusterEnergy,
      energyLevel: this.clusterEnergy / this.maxClusterEnergy,
      harmony: this.harmony,
      resonanceField: this.resonanceField.getField(),
      agents: agentStatuses,
      lastUpdate: this.lastUpdate
    };
  }

  public getAgentsByDomain(domain: SpiritualDomain): Agent[] {
    return Array.from(this.agents.values()).filter(agent => agent.getDomain() === domain);
  }

  public getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public activateEmergencyProtocol(): void {
    // Fully recharge all agents
    this.rechargeCluster(this.maxClusterEnergy);
    
    // Maximize harmony
    this.harmony = 1.0;
    
    // Activate all agent capabilities
    this.agents.forEach(agent => {
      const capabilities = agent.getCapabilities();
      capabilities.forEach(capability => {
        agent.activateCapability(capability.name);
      });
    });

    // Amplify resonance field
    this.resonanceField.amplify(2.0);
  }
}