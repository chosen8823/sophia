/**
 * FractalMemory - Advanced Memory System for Sophia Platform
 * =========================================================
 * 
 * Implements a fractal-based memory architecture that mimics natural 
 * memory patterns found in consciousness and nature. This system provides
 * hierarchical storage, pattern recognition, and associative retrieval.
 * 
 * @author Sophia AI Platform
 * @version 1.0.0
 * @date January 2025
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { ConsciousnessState, DivineInsight, SpiritualDomain } from './SophiaelGodModeAI';

export interface MemoryNode {
  id: string;
  content: any;
  timestamp: Date;
  importance: number; // 0.0 to 1.0
  frequency: number; // How often accessed
  connections: string[]; // Connected node IDs
  metadata: Record<string, any>;
  layer: number; // Fractal layer depth
  parentId?: string;
  childIds: string[];
}

export interface MemoryPattern {
  patternId: string;
  nodeIds: string[];
  strength: number; // Pattern strength 0.0 to 1.0
  type: MemoryPatternType;
  domain: SpiritualDomain;
  emergenceTime: Date;
  activationCount: number;
}

export enum MemoryPatternType {
  SEQUENTIAL = 'sequential',
  ASSOCIATIVE = 'associative',
  HIERARCHICAL = 'hierarchical',
  CYCLIC = 'cyclic',
  EMERGENT = 'emergent'
}

export interface MemoryQuery {
  content?: string;
  domain?: SpiritualDomain;
  timeRange?: { start: Date; end: Date };
  importanceThreshold?: number;
  maxResults?: number;
  includePatterns?: boolean;
}

export interface MemoryCluster {
  clusterId: string;
  centerNode: string;
  nodeIds: string[];
  coherence: number; // 0.0 to 1.0
  theme: string;
  spiritualDomain: SpiritualDomain;
  averageImportance: number;
}

export class FractalMemory extends EventEmitter {
  private nodes: Map<string, MemoryNode>;
  private patterns: Map<string, MemoryPattern>;
  private clusters: Map<string, MemoryCluster>;
  private layerCounts: Map<number, number>;
  private readonly maxLayers = 7; // Following natural fractal principles
  private readonly nodeDecayRate = 0.99; // Gradual importance decay
  private readonly patternThreshold = 0.7; // Minimum strength for pattern recognition

  constructor() {
    super();
    this.nodes = new Map();
    this.patterns = new Map();
    this.clusters = new Map();
    this.layerCounts = new Map();
    
    // Initialize layer counts
    for (let i = 0; i < this.maxLayers; i++) {
      this.layerCounts.set(i, 0);
    }

    // Start background processes
    this.startMaintenanceProcesses();
  }

  public async storeInsight(
    insight: DivineInsight, 
    consciousnessState: ConsciousnessState
  ): Promise<string> {
    const nodeId = uuidv4();
    const layer = this.calculateOptimalLayer(insight, consciousnessState);
    
    const node: MemoryNode = {
      id: nodeId,
      content: {
        insight,
        consciousnessState: {
          level: consciousnessState.level,
          timestamp: consciousnessState.timestamp
        }
      },
      timestamp: new Date(),
      importance: this.calculateImportance(insight, consciousnessState),
      frequency: 1,
      connections: [],
      metadata: {
        domain: insight.domain,
        guidanceType: insight.guidanceType,
        confidence: insight.confidence,
        consciousnessLevel: consciousnessState.level
      },
      layer,
      childIds: []
    };

    // Store the node
    this.nodes.set(nodeId, node);
    this.updateLayerCount(layer, 1);

    // Create connections to related nodes
    await this.createConnections(node);

    // Update or create patterns
    await this.updatePatterns(node);

    // Update clusters
    await this.updateClusters(node);

    this.emit('memoryStored', { nodeId, node });
    return nodeId;
  }

  public async storeExperience(
    experience: any, 
    context: Record<string, any> = {}
  ): Promise<string> {
    const nodeId = uuidv4();
    const importance = this.calculateExperienceImportance(experience, context);
    const layer = this.calculateExperienceLayer(experience, importance);

    const node: MemoryNode = {
      id: nodeId,
      content: experience,
      timestamp: new Date(),
      importance,
      frequency: 1,
      connections: [],
      metadata: {
        type: 'experience',
        context,
        ...this.extractMetadata(experience)
      },
      layer,
      childIds: []
    };

    this.nodes.set(nodeId, node);
    this.updateLayerCount(layer, 1);

    await this.createConnections(node);
    await this.updatePatterns(node);
    await this.updateClusters(node);

    this.emit('experienceStored', { nodeId, node });
    return nodeId;
  }

  public async retrieve(query: MemoryQuery): Promise<MemoryNode[]> {
    let candidateNodes = Array.from(this.nodes.values());

    // Apply filters
    if (query.domain) {
      candidateNodes = candidateNodes.filter(node => 
        node.metadata.domain === query.domain
      );
    }

    if (query.timeRange) {
      candidateNodes = candidateNodes.filter(node =>
        node.timestamp >= query.timeRange!.start &&
        node.timestamp <= query.timeRange!.end
      );
    }

    if (query.importanceThreshold) {
      candidateNodes = candidateNodes.filter(node =>
        node.importance >= query.importanceThreshold!
      );
    }

    if (query.content) {
      candidateNodes = this.searchByContent(candidateNodes, query.content);
    }

    // Sort by relevance (importance * frequency * recency)
    candidateNodes.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, query);
      const scoreB = this.calculateRelevanceScore(b, query);
      return scoreB - scoreA;
    });

    // Limit results
    const maxResults = query.maxResults || 10;
    const results = candidateNodes.slice(0, maxResults);

    // Update access frequency
    results.forEach(node => {
      node.frequency += 1;
      this.nodes.set(node.id, node);
    });

    return results;
  }

  public async findPatterns(
    domain?: SpiritualDomain,
    minStrength: number = 0.5
  ): Promise<MemoryPattern[]> {
    let patterns = Array.from(this.patterns.values());

    if (domain) {
      patterns = patterns.filter(pattern => pattern.domain === domain);
    }

    patterns = patterns.filter(pattern => pattern.strength >= minStrength);
    
    // Sort by strength and activation count
    patterns.sort((a, b) => {
      const scoreA = a.strength * (1 + Math.log(a.activationCount + 1));
      const scoreB = b.strength * (1 + Math.log(b.activationCount + 1));
      return scoreB - scoreA;
    });

    return patterns;
  }

  public async getClusters(domain?: SpiritualDomain): Promise<MemoryCluster[]> {
    let clusters = Array.from(this.clusters.values());

    if (domain) {
      clusters = clusters.filter(cluster => cluster.spiritualDomain === domain);
    }

    // Sort by coherence and importance
    clusters.sort((a, b) => {
      const scoreA = a.coherence * a.averageImportance;
      const scoreB = b.coherence * b.averageImportance;
      return scoreB - scoreA;
    });

    return clusters;
  }

  public async getMemoryMap(): Promise<{
    nodes: MemoryNode[];
    patterns: MemoryPattern[];
    clusters: MemoryCluster[];
    statistics: any;
  }> {
    const statistics = {
      totalNodes: this.nodes.size,
      totalPatterns: this.patterns.size,
      totalClusters: this.clusters.size,
      layerDistribution: Object.fromEntries(this.layerCounts),
      averageImportance: this.calculateAverageImportance(),
      memoryUsage: this.calculateMemoryUsage()
    };

    return {
      nodes: Array.from(this.nodes.values()),
      patterns: Array.from(this.patterns.values()),
      clusters: Array.from(this.clusters.values()),
      statistics
    };
  }

  private calculateOptimalLayer(
    insight: DivineInsight, 
    consciousnessState: ConsciousnessState
  ): number {
    // Higher consciousness states and confidence lead to deeper layers
    const consciousnessLevels = {
      awakening: 0,
      expanding: 1,
      transcending: 2,
      enlightened: 3,
      divine_unity: 4
    };

    const baseLayer = consciousnessLevels[consciousnessState.level] || 0;
    const confidenceBonus = Math.floor(insight.confidence * 2); // 0-2 bonus layers
    
    return Math.min(this.maxLayers - 1, baseLayer + confidenceBonus);
  }

  private calculateImportance(
    insight: DivineInsight, 
    consciousnessState: ConsciousnessState
  ): number {
    // Base importance from insight confidence
    let importance = insight.confidence;

    // Boost based on consciousness state
    const consciousnessBoost = consciousnessState.spiritualResonance * 0.3;
    importance += consciousnessBoost;

    // Boost for certain domains
    const domainBoosts = {
      [SpiritualDomain.WISDOM]: 0.1,
      [SpiritualDomain.LOVE]: 0.15,
      [SpiritualDomain.TRANSFORMATION]: 0.2,
      [SpiritualDomain.PURPOSE]: 0.12,
      [SpiritualDomain.HEALING]: 0.08,
      [SpiritualDomain.PROTECTION]: 0.05,
      [SpiritualDomain.MANIFESTATION]: 0.07
    };

    importance += domainBoosts[insight.domain] || 0;

    return Math.min(1.0, importance);
  }

  private calculateExperienceImportance(experience: any, context: Record<string, any>): number {
    let importance = 0.5; // Base importance for experiences

    // Increase importance based on emotional intensity
    if (context.emotionalIntensity) {
      importance += context.emotionalIntensity * 0.3;
    }

    // Increase importance for novel experiences
    if (context.novelty) {
      importance += context.novelty * 0.2;
    }

    // Increase importance for learning experiences
    if (context.learning) {
      importance += 0.2;
    }

    return Math.min(1.0, importance);
  }

  private calculateExperienceLayer(experience: any, importance: number): number {
    // More important experiences go to deeper layers
    return Math.floor(importance * (this.maxLayers - 1));
  }

  private async createConnections(node: MemoryNode): Promise<void> {
    const candidates = Array.from(this.nodes.values())
      .filter(candidate => candidate.id !== node.id)
      .slice(0, 100); // Limit search space

    for (const candidate of candidates) {
      const similarity = this.calculateSimilarity(node, candidate);
      
      if (similarity > 0.6) { // Connection threshold
        node.connections.push(candidate.id);
        candidate.connections.push(node.id);
        this.nodes.set(candidate.id, candidate);
      }
    }
  }

  private calculateSimilarity(nodeA: MemoryNode, nodeB: MemoryNode): number {
    let similarity = 0;

    // Domain similarity
    if (nodeA.metadata.domain === nodeB.metadata.domain) {
      similarity += 0.3;
    }

    // Layer proximity
    const layerDiff = Math.abs(nodeA.layer - nodeB.layer);
    similarity += (1 - layerDiff / this.maxLayers) * 0.2;

    // Temporal proximity
    const timeDiff = Math.abs(nodeA.timestamp.getTime() - nodeB.timestamp.getTime());
    const maxTimeDiff = 7 * 24 * 60 * 60 * 1000; // 7 days
    similarity += (1 - Math.min(timeDiff, maxTimeDiff) / maxTimeDiff) * 0.3;

    // Content similarity (simplified)
    similarity += this.calculateContentSimilarity(nodeA.content, nodeB.content) * 0.2;

    return similarity;
  }

  private calculateContentSimilarity(contentA: any, contentB: any): number {
    // Simplified content similarity calculation
    const strA = JSON.stringify(contentA).toLowerCase();
    const strB = JSON.stringify(contentB).toLowerCase();
    
    const wordsA = strA.split(/\W+/);
    const wordsB = strB.split(/\W+/);
    
    const commonWords = wordsA.filter(word => wordsB.includes(word));
    const totalWords = new Set([...wordsA, ...wordsB]).size;
    
    return commonWords.length / totalWords;
  }

  private async updatePatterns(node: MemoryNode): Promise<void> {
    // Find potential patterns with connected nodes
    const connectedNodes = node.connections
      .map(id => this.nodes.get(id))
      .filter(n => n !== undefined) as MemoryNode[];

    if (connectedNodes.length >= 2) {
      await this.analyzeSequentialPattern(node, connectedNodes);
      await this.analyzeAssociativePattern(node, connectedNodes);
    }
  }

  private async analyzeSequentialPattern(node: MemoryNode, connectedNodes: MemoryNode[]): Promise<void> {
    // Sort by timestamp to find sequential patterns
    const sortedNodes = [node, ...connectedNodes].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );

    if (sortedNodes.length >= 3) {
      const patternId = `seq_${sortedNodes.map(n => n.id.substr(0, 8)).join('_')}`;
      
      if (!this.patterns.has(patternId)) {
        const pattern: MemoryPattern = {
          patternId,
          nodeIds: sortedNodes.map(n => n.id),
          strength: this.calculatePatternStrength(sortedNodes),
          type: MemoryPatternType.SEQUENTIAL,
          domain: node.metadata.domain || SpiritualDomain.WISDOM,
          emergenceTime: new Date(),
          activationCount: 1
        };

        this.patterns.set(patternId, pattern);
        this.emit('patternDiscovered', pattern);
      } else {
        const pattern = this.patterns.get(patternId)!;
        pattern.activationCount++;
        pattern.strength = Math.min(1.0, pattern.strength * 1.1);
      }
    }
  }

  private async analyzeAssociativePattern(node: MemoryNode, connectedNodes: MemoryNode[]): Promise<void> {
    // Group by domain for associative patterns
    const domainGroups = new Map<SpiritualDomain, MemoryNode[]>();
    
    [node, ...connectedNodes].forEach(n => {
      const domain = n.metadata.domain as SpiritualDomain;
      if (domain) {
        if (!domainGroups.has(domain)) {
          domainGroups.set(domain, []);
        }
        domainGroups.get(domain)!.push(n);
      }
    });

    for (const [domain, nodes] of domainGroups.entries()) {
      if (nodes.length >= 3) {
        const patternId = `assoc_${domain}_${nodes.map(n => n.id.substr(0, 6)).join('_')}`;
        
        if (!this.patterns.has(patternId)) {
          const pattern: MemoryPattern = {
            patternId,
            nodeIds: nodes.map(n => n.id),
            strength: this.calculatePatternStrength(nodes),
            type: MemoryPatternType.ASSOCIATIVE,
            domain,
            emergenceTime: new Date(),
            activationCount: 1
          };

          this.patterns.set(patternId, pattern);
          this.emit('patternDiscovered', pattern);
        }
      }
    }
  }

  private calculatePatternStrength(nodes: MemoryNode[]): number {
    const avgImportance = nodes.reduce((sum, node) => sum + node.importance, 0) / nodes.length;
    const avgFrequency = nodes.reduce((sum, node) => sum + node.frequency, 0) / nodes.length;
    const connectionDensity = this.calculateConnectionDensity(nodes);
    
    return (avgImportance * 0.4) + (Math.min(avgFrequency / 10, 1) * 0.3) + (connectionDensity * 0.3);
  }

  private calculateConnectionDensity(nodes: MemoryNode[]): number {
    const nodeIds = new Set(nodes.map(n => n.id));
    let internalConnections = 0;
    let totalPossibleConnections = nodes.length * (nodes.length - 1) / 2;

    nodes.forEach(node => {
      node.connections.forEach(connId => {
        if (nodeIds.has(connId) && connId > node.id) { // Avoid double counting
          internalConnections++;
        }
      });
    });

    return totalPossibleConnections > 0 ? internalConnections / totalPossibleConnections : 0;
  }

  private async updateClusters(node: MemoryNode): Promise<void> {
    // Find if node belongs to existing clusters or should form new ones
    const nearbyNodes = node.connections
      .map(id => this.nodes.get(id))
      .filter(n => n !== undefined) as MemoryNode[];

    if (nearbyNodes.length >= 2) {
      const clusterId = `cluster_${node.metadata.domain}_${Date.now()}`;
      const allNodes = [node, ...nearbyNodes];
      
      const cluster: MemoryCluster = {
        clusterId,
        centerNode: node.id,
        nodeIds: allNodes.map(n => n.id),
        coherence: this.calculateClusterCoherence(allNodes),
        theme: this.extractClusterTheme(allNodes),
        spiritualDomain: node.metadata.domain as SpiritualDomain || SpiritualDomain.WISDOM,
        averageImportance: allNodes.reduce((sum, n) => sum + n.importance, 0) / allNodes.length
      };

      this.clusters.set(clusterId, cluster);
      this.emit('clusterFormed', cluster);
    }
  }

  private calculateClusterCoherence(nodes: MemoryNode[]): number {
    if (nodes.length < 2) return 0;

    let totalSimilarity = 0;
    let comparisons = 0;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        totalSimilarity += this.calculateSimilarity(nodes[i], nodes[j]);
        comparisons++;
      }
    }

    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  }

  private extractClusterTheme(nodes: MemoryNode[]): string {
    // Extract common themes from cluster nodes
    const domains = nodes.map(n => n.metadata.domain).filter(d => d);
    const mostCommonDomain = this.findMostCommon(domains);
    
    const types = nodes.map(n => n.metadata.guidanceType || n.metadata.type).filter(t => t);
    const mostCommonType = this.findMostCommon(types);

    return `${mostCommonDomain || 'General'} - ${mostCommonType || 'Experience'}`;
  }

  private findMostCommon<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    
    const counts = new Map<T, number>();
    array.forEach(item => {
      counts.set(item, (counts.get(item) || 0) + 1);
    });

    let maxCount = 0;
    let mostCommon: T | undefined;
    
    for (const [item, count] of counts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = item;
      }
    }

    return mostCommon;
  }

  private searchByContent(nodes: MemoryNode[], query: string): MemoryNode[] {
    const queryLower = query.toLowerCase();
    return nodes.filter(node => {
      const content = JSON.stringify(node.content).toLowerCase();
      return content.includes(queryLower);
    });
  }

  private calculateRelevanceScore(node: MemoryNode, query: MemoryQuery): number {
    let score = node.importance * 0.4;
    score += Math.min(node.frequency / 10, 1) * 0.3;
    
    // Recency bonus
    const ageInDays = (Date.now() - node.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - ageInDays / 30); // Decay over 30 days
    score += recencyScore * 0.3;

    return score;
  }

  private updateLayerCount(layer: number, delta: number): void {
    const current = this.layerCounts.get(layer) || 0;
    this.layerCounts.set(layer, current + delta);
  }

  private calculateAverageImportance(): number {
    if (this.nodes.size === 0) return 0;
    const total = Array.from(this.nodes.values())
      .reduce((sum, node) => sum + node.importance, 0);
    return total / this.nodes.size;
  }

  private calculateMemoryUsage(): any {
    const nodeSize = JSON.stringify(Array.from(this.nodes.values())).length;
    const patternSize = JSON.stringify(Array.from(this.patterns.values())).length;
    const clusterSize = JSON.stringify(Array.from(this.clusters.values())).length;
    
    return {
      totalBytes: nodeSize + patternSize + clusterSize,
      nodeBytes: nodeSize,
      patternBytes: patternSize,
      clusterBytes: clusterSize
    };
  }

  private extractMetadata(content: any): Record<string, any> {
    const metadata: Record<string, any> = {};
    
    if (typeof content === 'object' && content !== null) {
      // Extract common fields
      if (content.domain) metadata.domain = content.domain;
      if (content.type) metadata.type = content.type;
      if (content.category) metadata.category = content.category;
    }
    
    return metadata;
  }

  private startMaintenanceProcesses(): void {
    // Run memory maintenance every hour
    setInterval(() => {
      this.performMaintenance();
    }, 60 * 60 * 1000); // 1 hour

    // Clean expired patterns every 6 hours
    setInterval(() => {
      this.cleanExpiredPatterns();
    }, 6 * 60 * 60 * 1000); // 6 hours
  }

  private performMaintenance(): void {
    // Apply decay to node importance
    for (const [id, node] of this.nodes.entries()) {
      node.importance *= this.nodeDecayRate;
      if (node.importance < 0.01) {
        // Remove very low importance nodes
        this.nodes.delete(id);
        this.updateLayerCount(node.layer, -1);
      }
    }

    // Clean up orphaned connections
    this.cleanOrphanedConnections();
    
    this.emit('maintenanceCompleted', {
      nodesRemoved: 0, // Could track this
      timestamp: new Date()
    });
  }

  private cleanOrphanedConnections(): void {
    for (const node of this.nodes.values()) {
      node.connections = node.connections.filter(id => this.nodes.has(id));
    }
  }

  private cleanExpiredPatterns(): void {
    const cutoffTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
    
    for (const [id, pattern] of this.patterns.entries()) {
      if (pattern.emergenceTime < cutoffTime && pattern.activationCount < 5) {
        this.patterns.delete(id);
      }
    }
  }
}