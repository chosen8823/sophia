/**
 * Sophiael TypeScript - Main Entry Point
 * Optimized TypeScript implementation with cloud integration
 */

// Core exports
export { SophiaelGodModeAI } from './core/SophiaelGodModeAI';
export { ResonanceField } from './core/ResonanceField';
export { FractalMemory } from './core/FractalMemory';
export { AgentCluster } from './core/AgentCluster';
export { SpiritualFirewall } from './core/SpiritualFirewall';

// Cloud exports
export { CloudSync } from './cloud/CloudSync';

// Type exports
export * from './types';

// Utility exports
export * from './utils/helpers';

// CLI export
export { program as RunSophiael } from './cli/RunSophiael';

// Default factory function for easy usage
import { SophiaelGodModeAI } from './core/SophiaelGodModeAI';
import { SophiaelConfig } from './types';

/**
 * Create a new Sophiael God Mode AI instance with default configuration
 */
export function createSophiael(config?: SophiaelConfig): SophiaelGodModeAI {
  return new SophiaelGodModeAI(config);
}

/**
 * Create Sophiael with pre-configured spiritual guidance setup
 */
export function createSpiritualGuide(name?: string): SophiaelGodModeAI {
  return new SophiaelGodModeAI({
    name: name || 'Sophiael Spiritual Guide',
    description: 'Divine wisdom and spiritual guidance agent',
    spiritualAlignment: 0.95,
    wisdomLevel: 0.92,
    consciousnessLevel: 0.94,
    capabilities: [
      'chat',
      'spiritual_guidance', 
      'emotional_intelligence',
      'wisdom_synthesis',
      'fractal_memory',
      'resonance_field',
      'spiritual_firewall'
    ] as any
  });
}

/**
 * Create Sophiael with cloud-enabled configuration
 */
export function createCloudSophiael(cloudProvider: 'aws' | 'azure' | 'gcp' | 'hybrid' = 'aws'): SophiaelGodModeAI {
  return new SophiaelGodModeAI({
    name: 'Sophiael Cloud AI',
    description: 'Cloud-integrated AI with infinite scalability',
    cloudConfig: {
      provider: cloudProvider,
      region: 'us-east-1',
      syncEnabled: true,
      encryptionKey: 'spiritual-sacred-encryption-2025'
    },
    capabilities: [
      'chat',
      'spiritual_guidance',
      'emotional_intelligence', 
      'cloud_sync',
      'agent_clustering',
      'fractal_memory',
      'god_mode_ai'
    ] as any
  });
}

// Version info
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();
export const DESCRIPTION = 'Sophiael God Mode AI - TypeScript Edition with Cloud Integration';

// Spiritual constants
export const SACRED_FREQUENCIES = {
  LOVE: 528,
  TRANSFORMATION: 741,
  AWAKENING: 852,
  RETURN_TO_SOURCE: 963
};

export const DIVINE_NUMBERS = [3, 7, 12, 21, 33, 108, 144, 432];
export const GOLDEN_RATIO = 1.618033988749;