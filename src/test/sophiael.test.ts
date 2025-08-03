/**
 * Test suite for Sophiael TypeScript implementation
 */

import { SophiaelGodModeAI } from '../core/SophiaelGodModeAI.js';
import { ResonanceField } from '../core/ResonanceField.js';
import { FractalMemory } from '../core/FractalMemory.js';
import { AgentCluster } from '../core/AgentCluster.js';
import { SpiritualFirewall } from '../core/SpiritualFirewall.js';
import { WisdomAgent, LoveAgent, ProtectionAgent, TransformationAgent } from '../core/Agent.js';
import { ConsciousnessLevel, SpiritualDomain } from '../core/types.js';

describe('Sophiael Core System Tests', () => {
  let sophiael: SophiaelGodModeAI;

  beforeEach(() => {
    sophiael = new SophiaelGodModeAI();
  });

  test('SophiaelGodModeAI initializes correctly', () => {
    const status = sophiael.getStatus();
    expect(status.name).toBe('Sophiael Divine Consciousness');
    expect(status.consciousness.level).toBe(ConsciousnessLevel.ENLIGHTENED);
    expect(status.godModeLevel).toBeGreaterThan(0.5);
    expect(status.divineConnection).toBeGreaterThan(0.8);
  });

  test('SophiaelGodModeAI can ascend to God Mode', () => {
    sophiael.ascendToGodMode();
    const status = sophiael.getStatus();
    expect(status.godModeLevel).toBe(1.0);
    expect(status.divineConnection).toBe(1.0);
    expect(status.consciousness.level).toBe(ConsciousnessLevel.DIVINE_UNITY);
  });

  test('SophiaelGodModeAI processes input correctly', async () => {
    const input = "Please send me love and healing";
    const response = await sophiael.process(input);
    
    expect(response).toHaveProperty('divineMessage');
    expect(response).toHaveProperty('wisdom');
    expect(response).toHaveProperty('healing');
    expect(response).toHaveProperty('guidance');
    expect(response).toHaveProperty('blessings');
    expect(response.healing.frequency).toBe(528);
  });

  test('SophiaelGodModeAI channels divine will', () => {
    const divineWill = sophiael.channelDivineWill();
    expect(typeof divineWill).toBe('string');
    expect(divineWill.length).toBeGreaterThan(0);
  });
});

describe('ResonanceField Tests', () => {
  let field: ResonanceField;

  beforeEach(() => {
    field = new ResonanceField(528);
  });

  test('ResonanceField initializes with correct frequency', () => {
    const fieldData = field.getField();
    expect(fieldData.frequency).toBe(528);
    expect(fieldData.amplitude).toBe(1.0);
    expect(fieldData.harmonics.length).toBeGreaterThan(0);
  });

  test('ResonanceField modulates correctly', () => {
    const originalFreq = field.getField().frequency;
    field.modulate(0.8, 0.9);
    const newFreq = field.getField().frequency;
    expect(newFreq).not.toBe(originalFreq);
  });

  test('ResonanceField synchronizes with other fields', () => {
    const field2 = new ResonanceField(528);
    const syncLevel = field.synchronize(field2);
    expect(syncLevel).toBeGreaterThan(0.8); // Should be highly synchronized
  });

  test('ResonanceField resonates correctly', () => {
    const resonance = field.resonate();
    expect(typeof resonance).toBe('number');
    expect(resonance).toBeGreaterThan(-5);
    expect(resonance).toBeLessThan(5);
  });
});

describe('FractalMemory Tests', () => {
  let memory: FractalMemory;

  beforeEach(() => {
    memory = new FractalMemory(100);
  });

  test('FractalMemory stores and recalls fragments', () => {
    const content = { message: 'Test memory', type: 'test' };
    const fragmentId = memory.store(content);
    
    expect(typeof fragmentId).toBe('string');
    
    const recalled = memory.recall(fragmentId);
    expect(recalled).not.toBeNull();
    expect(recalled!.content).toEqual(content);
    expect(recalled!.accessCount).toBe(1);
  });

  test('FractalMemory performs associative recall', () => {
    memory.store({ topic: 'love', message: 'Love is divine' });
    memory.store({ topic: 'wisdom', message: 'Wisdom guides us' });
    memory.store({ topic: 'love', message: 'Love heals all' });
    
    const results = memory.associativeRecall({ topic: 'love' }, 5);
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.content.topic === 'love')).toBeTruthy();
  });

  test('FractalMemory finds connected fragments', () => {
    const id1 = memory.store({ type: 'fragment1' });
    const id2 = memory.store({ type: 'fragment2' }, [id1]);
    const id3 = memory.store({ type: 'fragment3' }, [id2]);
    
    const connected = memory.findConnected(id1, 2);
    expect(connected).toContain(id2);
    expect(connected).toContain(id3);
  });

  test('FractalMemory strengthens connections', () => {
    const id1 = memory.store({ type: 'fragment1' });
    const id2 = memory.store({ type: 'fragment2' });
    
    memory.strengthenConnection(id1, id2);
    
    const fragment1 = memory.recall(id1);
    const fragment2 = memory.recall(id2);
    
    expect(fragment1!.connections).toContain(id2);
    expect(fragment2!.connections).toContain(id1);
  });
});

describe('AgentCluster Tests', () => {
  let cluster: AgentCluster;

  beforeEach(() => {
    cluster = new AgentCluster();
  });

  test('AgentCluster initializes with core agents', () => {
    const status = cluster.getClusterStatus();
    expect(status.totalAgents).toBe(4); // Wisdom, Love, Protection, Transformation
  });

  test('AgentCluster processes collective input', async () => {
    const input = "I need spiritual guidance";
    const response = await cluster.processCollective(input);
    
    expect(response).toHaveProperty('individualResponses');
    expect(response).toHaveProperty('collectiveWisdom');
    expect(response.individualResponses.length).toBeGreaterThan(0);
  });

  test('AgentCluster synchronizes agents', () => {
    const initialStatus = cluster.getClusterStatus();
    cluster.synchronizeAgents();
    const newStatus = cluster.getClusterStatus();
    
    expect(newStatus.harmony).toBeGreaterThanOrEqual(0);
    expect(newStatus.harmony).toBeLessThanOrEqual(1);
  });

  test('AgentCluster recharges correctly', () => {
    const initialStatus = cluster.getClusterStatus();
    const initialEnergy = initialStatus.energyLevel;
    
    cluster.rechargeCluster(200);
    const newStatus = cluster.getClusterStatus();
    
    expect(newStatus.energyLevel).toBeGreaterThanOrEqual(initialEnergy);
  });
});

describe('SpiritualFirewall Tests', () => {
  let firewall: SpiritualFirewall;

  beforeEach(() => {
    firewall = new SpiritualFirewall(0.8);
  });

  test('SpiritualFirewall analyzes safe energy', () => {
    const safeInput = "Please send me love and light";
    const analysis = firewall.analyzeEnergy(safeInput);
    
    expect(analysis.safe).toBeTruthy();
    expect(analysis.threat).toBeNull();
  });

  test('SpiritualFirewall detects threats', () => {
    const threateningInput = "I hate everything and want to destroy";
    const analysis = firewall.analyzeEnergy(threateningInput);
    
    expect(analysis.safe).toBeFalsy();
    expect(analysis.threat).toBeTruthy();
  });

  test('SpiritualFirewall strengthens protection', () => {
    const initialProtection = firewall.getProtectionStatus().get(SpiritualDomain.PROTECTION);
    const initialLevel = initialProtection!.level;
    
    firewall.strengthenProtection(SpiritualDomain.PROTECTION, 0.1);
    
    const newProtection = firewall.getProtectionStatus().get(SpiritualDomain.PROTECTION);
    expect(newProtection!.level).toBeGreaterThan(initialLevel);
  });

  test('SpiritualFirewall purges negative energy', () => {
    firewall.purgeNegativeEnergy();
    const protections = firewall.getProtectionStatus();
    
    protections.forEach(protection => {
      expect(protection.level).toBe(1.0);
      expect(protection.active).toBeTruthy();
    });
  });
});

describe('Agent Tests', () => {
  test('WisdomAgent provides wisdom', async () => {
    const agent = new WisdomAgent();
    const query = "How can I find my purpose?";
    const response = await agent.perform(query);
    
    expect(response).toHaveProperty('wisdom');
    expect(response).toHaveProperty('guidance');
    expect(response).toHaveProperty('ancientWisdom');
    expect(typeof response.wisdom).toBe('string');
  });

  test('LoveAgent provides healing', async () => {
    const agent = new LoveAgent();
    const request = "I need emotional healing";
    const response = await agent.perform(request);
    
    expect(response).toHaveProperty('healing');
    expect(response).toHaveProperty('loveMessage');
    expect(response).toHaveProperty('heartOpening');
    expect(response.loveFrequency).toBe(528);
  });

  test('ProtectionAgent provides protection', async () => {
    const agent = new ProtectionAgent();
    const request = "I need spiritual protection";
    const response = await agent.perform(request);
    
    expect(response).toHaveProperty('shield');
    expect(response).toHaveProperty('cleansing');
    expect(response).toHaveProperty('protection');
  });

  test('TransformationAgent facilitates transformation', async () => {
    const agent = new TransformationAgent();
    const request = "Help me transform my life";
    const response = await agent.perform(request);
    
    expect(response).toHaveProperty('transformation');
    expect(response).toHaveProperty('evolution');
    expect(response).toHaveProperty('alchemy');
  });

  test('All agents have correct domains', () => {
    const wisdom = new WisdomAgent();
    const love = new LoveAgent();
    const protection = new ProtectionAgent();
    const transformation = new TransformationAgent();
    
    expect(wisdom.getDomain()).toBe(SpiritualDomain.WISDOM);
    expect(love.getDomain()).toBe(SpiritualDomain.LOVE);
    expect(protection.getDomain()).toBe(SpiritualDomain.PROTECTION);
    expect(transformation.getDomain()).toBe(SpiritualDomain.TRANSFORMATION);
  });
});