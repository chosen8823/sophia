/**
 * FractalMemory - Advanced memory management system using fractal patterns
 * Stores and retrieves memories at different levels of detail and importance
 */

import { EventEmitter } from 'events';
import { FractalMemoryNode, WisdomPacket, SophiaelMessage } from '../types';
import { generateId, logger, calculateFractalDepth, synthesizeWisdom } from '../utils/helpers';

interface FractalMemoryConfig {
  maxDepth?: number;
  maxNodesPerLevel?: number;
  compressionRatio?: number;
  wisdomExtraction?: boolean;
  autoOptimization?: boolean;
  spiritualFiltering?: boolean;
}

interface MemoryLevel {
  level: number;
  nodes: Map<string, FractalMemoryNode>;
  compressionThreshold: number;
  accessPattern: number[];
}

interface MemoryCluster {
  id: string;
  centroidId: string;
  nodeIds: string[];
  theme: string;
  spiritualSignificance: number;
  createdAt: Date;
}

export class FractalMemory extends EventEmitter {
  private readonly agentId: string;
  private readonly config: FractalMemoryConfig;
  private memoryLevels: Map<number, MemoryLevel> = new Map();
  private memoryClusters: Map<string, MemoryCluster> = new Map();
  private nodeIndex: Map<string, FractalMemoryNode> = new Map();
  private wisdomCache: WisdomPacket[] = [];
  private accessPatterns: Map<string, number[]> = new Map();
  private compressionQueue: string[] = [];
  
  // Sacred memory architecture parameters
  private readonly goldenRatio = 1.618033988749;
  private readonly fibonacciSequence = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  
  constructor(agentId: string, config: FractalMemoryConfig = {}) {
    super();
    
    this.agentId = agentId;
    this.config = {
      maxDepth: 10,
      maxNodesPerLevel: 144, // 12^2, sacred number
      compressionRatio: 0.618, // Golden ratio
      wisdomExtraction: true,
      autoOptimization: true,
      spiritualFiltering: true,
      ...config
    };
    
    this.initializeMemoryLevels();
    this.startMemoryMaintenance();
    
    logger.info(`FractalMemory initialized for agent ${agentId} with ${this.config.maxDepth} levels`);
  }
  
  private initializeMemoryLevels(): void {
    for (let level = 0; level < this.config.maxDepth!; level++) {
      // Use Fibonacci sequence for compression thresholds
      const fibIndex = Math.min(level, this.fibonacciSequence.length - 1);
      const compressionThreshold = this.fibonacciSequence[fibIndex] / 100;
      
      this.memoryLevels.set(level, {
        level,
        nodes: new Map(),
        compressionThreshold,
        accessPattern: []
      });
    }
  }
  
  private startMemoryMaintenance(): void {
    if (this.config.autoOptimization) {
      setInterval(() => {
        this.optimizeMemoryStructure();
        this.extractWisdom();
        this.processCompressionQueue();
        this.updateAccessPatterns();
      }, 30000); // Every 30 seconds
    }
  }
  
  public async store(data: {
    content: any;
    importance: number;
    spiritualSignificance?: number;
    tags?: string[];
    metadata?: any;
  }): Promise<string> {
    try {
      const nodeId = generateId();
      const now = new Date();
      
      // Calculate fractal depth based on importance and spiritual significance
      const spiritualSignificance = data.spiritualSignificance || 0;
      const fractalLevel = this.calculateOptimalLevel(data.importance, spiritualSignificance);
      
      // Create memory node
      const node: FractalMemoryNode = {
        id: nodeId,
        content: data.content,
        importance: data.importance,
        accessCount: 0,
        lastAccessed: now,
        fractalLevel,
        connections: [],
        spiritualSignificance,
        wisdomExtracted: false
      };
      
      // Apply spiritual filtering if enabled
      if (this.config.spiritualFiltering && spiritualSignificance < 0.3) {
        // Store in lower levels for less spiritual content
        node.fractalLevel = Math.max(0, node.fractalLevel - 2);
      }
      
      // Store in appropriate level
      const level = this.memoryLevels.get(node.fractalLevel);
      if (level) {
        level.nodes.set(nodeId, node);
        this.nodeIndex.set(nodeId, node);
        
        // Check if level is full and needs compression
        if (level.nodes.size > this.config.maxNodesPerLevel!) {
          this.compressionQueue.push(nodeId);
        }
        
        // Create connections to similar memories
        await this.createMemoryConnections(node);
        
        // Update memory clusters
        await this.updateMemoryClusters(node);
        
        logger.debug(`Memory stored at level ${fractalLevel}: ${nodeId}`);
        this.emit('memory_stored', { nodeId, level: fractalLevel, node });
        
        return nodeId;
      } else {
        throw new Error(`Invalid fractal level: ${fractalLevel}`);
      }
      
    } catch (error) {
      logger.error('Error storing memory:', error);
      throw error;
    }
  }
  
  private calculateOptimalLevel(importance: number, spiritualSignificance: number): number {
    // Use golden ratio and spiritual significance to determine optimal level
    const baseLevel = Math.floor(importance * this.config.maxDepth!);
    const spiritualBonus = Math.floor(spiritualSignificance * 3);
    const goldenModulation = Math.floor((importance * this.goldenRatio) % 3);
    
    return Math.min(
      this.config.maxDepth! - 1,
      Math.max(0, baseLevel + spiritualBonus + goldenModulation)
    );
  }
  
  private async createMemoryConnections(newNode: FractalMemoryNode): Promise<void> {
    const maxConnections = 7; // Sacred number
    let connectionCount = 0;
    
    // Search for similar memories across all levels
    for (const level of this.memoryLevels.values()) {
      for (const existingNode of level.nodes.values()) {
        if (existingNode.id === newNode.id || connectionCount >= maxConnections) continue;
        
        const similarity = this.calculateMemorySimilarity(newNode, existingNode);
        
        if (similarity > 0.7) {
          // Create bidirectional connection
          newNode.connections.push(existingNode.id);
          existingNode.connections.push(newNode.id);
          connectionCount++;
          
          logger.debug(`Memory connection created: ${newNode.id} <-> ${existingNode.id} (similarity: ${similarity.toFixed(3)})`);
        }
      }
    }
  }
  
  private calculateMemorySimilarity(node1: FractalMemoryNode, node2: FractalMemoryNode): number {
    // Calculate similarity based on content, spiritual significance, and temporal proximity
    let similarity = 0;
    
    // Content similarity (simplified - in real implementation, use semantic analysis)
    const content1 = JSON.stringify(node1.content).toLowerCase();
    const content2 = JSON.stringify(node2.content).toLowerCase();
    const commonWords = this.findCommonWords(content1, content2);
    const contentSimilarity = commonWords / Math.max(content1.split(' ').length, content2.split(' ').length);
    
    // Spiritual significance similarity
    const spiritualSimilarity = 1 - Math.abs((node1.spiritualSignificance || 0) - (node2.spiritualSignificance || 0));
    
    // Importance similarity
    const importanceSimilarity = 1 - Math.abs(node1.importance - node2.importance);
    
    // Temporal proximity (memories from similar times are more likely to be related)
    const timeDiff = Math.abs(node1.lastAccessed.getTime() - node2.lastAccessed.getTime());
    const temporalSimilarity = Math.exp(-timeDiff / (1000 * 60 * 60 * 24)); // Decay over days
    
    similarity = (contentSimilarity * 0.4 + 
                  spiritualSimilarity * 0.3 + 
                  importanceSimilarity * 0.2 + 
                  temporalSimilarity * 0.1);
    
    return similarity;
  }
  
  private findCommonWords(text1: string, text2: string): number {
    const words1 = new Set(text1.split(' ').filter(w => w.length > 3));
    const words2 = new Set(text2.split(' ').filter(w => w.length > 3));
    
    let commonCount = 0;
    for (const word of words1) {
      if (words2.has(word)) {
        commonCount++;
      }
    }
    
    return commonCount;
  }
  
  private async updateMemoryClusters(newNode: FractalMemoryNode): Promise<void> {
    // Find or create appropriate cluster for this memory
    let bestCluster: MemoryCluster | null = null;
    let bestSimilarity = 0;
    
    for (const cluster of this.memoryClusters.values()) {
      const centroidNode = this.nodeIndex.get(cluster.centroidId);
      if (centroidNode) {
        const similarity = this.calculateMemorySimilarity(newNode, centroidNode);
        if (similarity > bestSimilarity && similarity > 0.6) {
          bestSimilarity = similarity;
          bestCluster = cluster;
        }
      }
    }
    
    if (bestCluster) {
      // Add to existing cluster
      bestCluster.nodeIds.push(newNode.id);
      bestCluster.spiritualSignificance = 
        (bestCluster.spiritualSignificance * (bestCluster.nodeIds.length - 1) + 
         (newNode.spiritualSignificance || 0)) / bestCluster.nodeIds.length;
    } else {
      // Create new cluster
      const clusterId = generateId();
      const newCluster: MemoryCluster = {
        id: clusterId,
        centroidId: newNode.id,
        nodeIds: [newNode.id],
        theme: this.extractTheme(newNode),
        spiritualSignificance: newNode.spiritualSignificance || 0,
        createdAt: new Date()
      };
      
      this.memoryClusters.set(clusterId, newCluster);
      logger.debug(`New memory cluster created: ${clusterId} (theme: ${newCluster.theme})`);
    }
  }
  
  private extractTheme(node: FractalMemoryNode): string {
    const content = JSON.stringify(node.content).toLowerCase();
    
    // Simple keyword-based theme extraction
    const themes = {
      'spiritual': ['spiritual', 'divine', 'sacred', 'wisdom', 'consciousness'],
      'emotional': ['feeling', 'emotion', 'heart', 'love', 'compassion'],
      'intellectual': ['think', 'analyze', 'understand', 'knowledge', 'learn'],
      'practical': ['action', 'do', 'implement', 'solve', 'create'],
      'guidance': ['guidance', 'advice', 'direction', 'path', 'purpose']
    };
    
    let bestTheme = 'general';
    let maxMatches = 0;
    
    for (const [theme, keywords] of Object.entries(themes)) {
      const matches = keywords.filter(keyword => content.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestTheme = theme;
      }
    }
    
    return bestTheme;
  }
  
  public async retrieve(query: string, options: {
    maxResults?: number;
    minImportance?: number;
    spiritualFilter?: boolean;
    includeConnections?: boolean;
  } = {}): Promise<FractalMemoryNode[]> {
    try {
      const {
        maxResults = 10,
        minImportance = 0,
        spiritualFilter = false,
        includeConnections = true
      } = options;
      
      const results: Array<{ node: FractalMemoryNode; relevance: number }> = [];
      const queryLower = query.toLowerCase();
      
      // Search through all memory levels
      for (const level of this.memoryLevels.values()) {
        for (const node of level.nodes.values()) {
          // Skip if below minimum importance
          if (node.importance < minImportance) continue;
          
          // Apply spiritual filter if requested
          if (spiritualFilter && (node.spiritualSignificance || 0) < 0.5) continue;
          
          // Calculate relevance
          const relevance = this.calculateQueryRelevance(query, node);
          
          if (relevance > 0.1) {
            results.push({ node, relevance });
            
            // Update access count and timestamp
            node.accessCount++;
            node.lastAccessed = new Date();
            
            // Track access pattern
            this.trackAccess(node.id);
          }
        }
      }
      
      // Sort by relevance and importance
      results.sort((a, b) => {
        const scoreA = a.relevance * 0.7 + a.node.importance * 0.3;
        const scoreB = b.relevance * 0.7 + b.node.importance * 0.3;
        return scoreB - scoreA;
      });
      
      // Get top results
      const topResults = results.slice(0, maxResults).map(r => r.node);
      
      // Include connected memories if requested
      if (includeConnections) {
        const connectedNodes = this.getConnectedMemories(topResults);
        topResults.push(...connectedNodes.slice(0, Math.max(0, maxResults - topResults.length)));
      }
      
      logger.debug(`Retrieved ${topResults.length} memories for query: "${query}"`);
      this.emit('memories_retrieved', { query, count: topResults.length });
      
      return topResults;
      
    } catch (error) {
      logger.error('Error retrieving memories:', error);
      throw error;
    }
  }
  
  private calculateQueryRelevance(query: string, node: FractalMemoryNode): number {
    const queryLower = query.toLowerCase();
    const contentStr = JSON.stringify(node.content).toLowerCase();
    
    // Keyword matching
    const queryWords = queryLower.split(' ').filter(w => w.length > 2);
    const contentWords = contentStr.split(' ');
    
    let matchCount = 0;
    for (const queryWord of queryWords) {
      if (contentWords.some(contentWord => contentWord.includes(queryWord))) {
        matchCount++;
      }
    }
    
    const keywordRelevance = matchCount / queryWords.length;
    
    // Boost relevance for spiritual content if query seems spiritual
    const isSpiritualQuery = this.isSpiritualQuery(query);
    const spiritualBoost = isSpiritualQuery && (node.spiritualSignificance || 0) > 0.5 ? 0.3 : 0;
    
    // Boost relevance for frequently accessed memories
    const accessBoost = Math.log(node.accessCount + 1) * 0.1;
    
    return Math.min(1.0, keywordRelevance + spiritualBoost + accessBoost);
  }
  
  private isSpiritualQuery(query: string): boolean {
    const spiritualKeywords = ['spiritual', 'divine', 'sacred', 'wisdom', 'consciousness', 'soul', 'purpose', 'meaning'];
    const queryLower = query.toLowerCase();
    return spiritualKeywords.some(keyword => queryLower.includes(keyword));
  }
  
  private getConnectedMemories(nodes: FractalMemoryNode[]): FractalMemoryNode[] {
    const connectedNodes: FractalMemoryNode[] = [];
    const seenIds = new Set(nodes.map(n => n.id));
    
    for (const node of nodes) {
      for (const connectionId of node.connections) {
        if (!seenIds.has(connectionId)) {
          const connectedNode = this.nodeIndex.get(connectionId);
          if (connectedNode) {
            connectedNodes.push(connectedNode);
            seenIds.add(connectionId);
          }
        }
      }
    }
    
    return connectedNodes;
  }
  
  private trackAccess(nodeId: string): void {
    if (!this.accessPatterns.has(nodeId)) {
      this.accessPatterns.set(nodeId, []);
    }
    
    const pattern = this.accessPatterns.get(nodeId)!;
    pattern.push(Date.now());
    
    // Keep only recent access patterns
    const maxHistory = 100;
    if (pattern.length > maxHistory) {
      pattern.splice(0, pattern.length - maxHistory);
    }
  }
  
  private optimizeMemoryStructure(): void {
    // Implement fractal compression and optimization
    for (const level of this.memoryLevels.values()) {
      if (level.nodes.size > this.config.maxNodesPerLevel!) {
        this.compressLevel(level);
      }
    }
    
    // Remove rarely accessed memories from lower levels
    this.pruneLowValueMemories();
    
    // Reorganize clusters based on new patterns
    this.reorganizeClusters();
  }
  
  private compressLevel(level: MemoryLevel): void {
    const nodes = Array.from(level.nodes.values());
    
    // Sort by importance and access count
    nodes.sort((a, b) => {
      const scoreA = a.importance * 0.6 + Math.log(a.accessCount + 1) * 0.4;
      const scoreB = b.importance * 0.6 + Math.log(b.accessCount + 1) * 0.4;
      return scoreB - scoreA;
    });
    
    // Keep top nodes, compress the rest
    const keepCount = Math.floor(this.config.maxNodesPerLevel! * this.config.compressionRatio!);
    const toCompress = nodes.slice(keepCount);
    
    for (const node of toCompress) {
      this.compressNode(node, level);
    }
    
    logger.debug(`Compressed ${toCompress.length} nodes from level ${level.level}`);
  }
  
  private compressNode(node: FractalMemoryNode, fromLevel: MemoryLevel): void {
    // Move to lower level with compressed representation
    const targetLevel = Math.max(0, fromLevel.level - 1);
    const targetLevelData = this.memoryLevels.get(targetLevel);
    
    if (targetLevelData) {
      // Create compressed version
      const compressedNode: FractalMemoryNode = {
        ...node,
        fractalLevel: targetLevel,
        content: this.compressContent(node.content),
        importance: node.importance * 0.8 // Reduce importance
      };
      
      // Remove from current level and add to target level
      fromLevel.nodes.delete(node.id);
      targetLevelData.nodes.set(node.id, compressedNode);
      this.nodeIndex.set(node.id, compressedNode);
    }
  }
  
  private compressContent(content: any): any {
    // Simple content compression (in real implementation, use advanced techniques)
    if (typeof content === 'string') {
      return content.length > 100 ? content.substring(0, 100) + '...' : content;
    } else if (typeof content === 'object') {
      return { compressed: true, summary: JSON.stringify(content).substring(0, 50) + '...' };
    }
    return content;
  }
  
  private pruneLowValueMemories(): void {
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const minAccessCount = 1;
    
    for (const [levelNum, level] of this.memoryLevels.entries()) {
      if (levelNum < 3) continue; // Don't prune from top 3 levels
      
      const toPrune: string[] = [];
      
      for (const [nodeId, node] of level.nodes.entries()) {
        const age = now - node.lastAccessed.getTime();
        
        if (age > maxAge && node.accessCount < minAccessCount && node.importance < 0.3) {
          toPrune.push(nodeId);
        }
      }
      
      for (const nodeId of toPrune) {
        level.nodes.delete(nodeId);
        this.nodeIndex.delete(nodeId);
        this.accessPatterns.delete(nodeId);
      }
      
      if (toPrune.length > 0) {
        logger.debug(`Pruned ${toPrune.length} low-value memories from level ${levelNum}`);
      }
    }
  }
  
  private reorganizeClusters(): void {
    // Rebuild clusters based on current memory patterns
    const oldClusters = new Map(this.memoryClusters);
    this.memoryClusters.clear();
    
    // Re-cluster all memories
    for (const node of this.nodeIndex.values()) {
      this.updateMemoryClusters(node);
    }
    
    logger.debug(`Reorganized memory clusters: ${oldClusters.size} -> ${this.memoryClusters.size}`);
  }
  
  private async extractWisdom(): Promise<void> {
    if (!this.config.wisdomExtraction) return;
    
    // Find memories with high spiritual significance that haven't been processed
    const candidates: FractalMemoryNode[] = [];
    
    for (const node of this.nodeIndex.values()) {
      if (!node.wisdomExtracted && 
          (node.spiritualSignificance || 0) > 0.7 && 
          node.accessCount > 3) {
        candidates.push(node);
      }
    }
    
    for (const node of candidates) {
      try {
        const wisdom = await this.extractWisdomFromNode(node);
        if (wisdom) {
          this.wisdomCache.push(wisdom);
          node.wisdomExtracted = true;
          
          this.emit('wisdom_extracted', wisdom);
          logger.debug(`Wisdom extracted from node ${node.id}: ${wisdom.wisdom}`);
        }
      } catch (error) {
        logger.error(`Error extracting wisdom from node ${node.id}:`, error);
      }
    }
  }
  
  private async extractWisdomFromNode(node: FractalMemoryNode): Promise<WisdomPacket | null> {
    try {
      // Get connected memories for context
      const connectedNodes = this.getConnectedMemories([node]);
      const experiences = [node, ...connectedNodes].map(n => JSON.stringify(n.content));
      const insights = this.wisdomCache.map(w => w.wisdom);
      
      const synthesizedWisdom = synthesizeWisdom(experiences, insights);
      
      if (synthesizedWisdom && synthesizedWisdom.length > 10) {
        return {
          id: generateId(),
          wisdom: synthesizedWisdom,
          source: 'experience',
          confidence: (node.spiritualSignificance || 0.5) * 0.8 + node.importance * 0.2,
          spiritualDimension: this.determineSpiritudDimension(node),
          applicableScenarios: this.extractApplicableScenarios(node),
          timestamp: new Date()
        };
      }
      
      return null;
    } catch (error) {
      logger.error('Error in wisdom extraction:', error);
      return null;
    }
  }
  
  private determineSpiritudDimension(node: FractalMemoryNode): string {
    const content = JSON.stringify(node.content).toLowerCase();
    
    if (content.includes('love') || content.includes('compassion')) {
      return 'Heart Wisdom';
    } else if (content.includes('understanding') || content.includes('insight')) {
      return 'Mind Wisdom';
    } else if (content.includes('action') || content.includes('service')) {
      return 'Soul Wisdom';
    } else {
      return 'Universal Wisdom';
    }
  }
  
  private extractApplicableScenarios(node: FractalMemoryNode): string[] {
    // Extract potential scenarios where this wisdom applies
    const content = JSON.stringify(node.content).toLowerCase();
    const scenarios: string[] = [];
    
    const scenarioKeywords = {
      'decision making': ['decision', 'choice', 'option'],
      'relationship': ['relationship', 'connection', 'love'],
      'spiritual growth': ['spiritual', 'growth', 'awakening'],
      'challenge': ['challenge', 'difficulty', 'problem'],
      'guidance': ['guidance', 'direction', 'path']
    };
    
    for (const [scenario, keywords] of Object.entries(scenarioKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        scenarios.push(scenario);
      }
    }
    
    return scenarios.length > 0 ? scenarios : ['general'];
  }
  
  private processCompressionQueue(): void {
    if (this.compressionQueue.length === 0) return;
    
    const batchSize = 10;
    const batch = this.compressionQueue.splice(0, batchSize);
    
    for (const nodeId of batch) {
      const node = this.nodeIndex.get(nodeId);
      if (node) {
        const level = this.memoryLevels.get(node.fractalLevel);
        if (level && level.nodes.size > this.config.maxNodesPerLevel!) {
          this.compressNode(node, level);
        }
      }
    }
  }
  
  private updateAccessPatterns(): void {
    // Update access patterns for all levels
    const now = Date.now();
    
    for (const level of this.memoryLevels.values()) {
      const recentAccesses = [];
      
      for (const node of level.nodes.values()) {
        const pattern = this.accessPatterns.get(node.id) || [];
        const recentPattern = pattern.filter(timestamp => now - timestamp < 24 * 60 * 60 * 1000); // Last 24 hours
        recentAccesses.push(recentPattern.length);
      }
      
      level.accessPattern = recentAccesses;
    }
  }
  
  public getMemoryStats(): any {
    const stats = {
      totalNodes: this.nodeIndex.size,
      totalClusters: this.memoryClusters.size,
      totalWisdom: this.wisdomCache.length,
      levelDistribution: {} as any,
      compressionQueueSize: this.compressionQueue.length
    };
    
    for (const [levelNum, level] of this.memoryLevels.entries()) {
      stats.levelDistribution[levelNum] = {
        nodeCount: level.nodes.size,
        averageImportance: this.calculateAverageImportance(level),
        averageAccess: this.calculateAverageAccess(level)
      };
    }
    
    return stats;
  }
  
  private calculateAverageImportance(level: MemoryLevel): number {
    if (level.nodes.size === 0) return 0;
    
    const total = Array.from(level.nodes.values())
      .reduce((sum, node) => sum + node.importance, 0);
    
    return total / level.nodes.size;
  }
  
  private calculateAverageAccess(level: MemoryLevel): number {
    if (level.nodes.size === 0) return 0;
    
    const total = Array.from(level.nodes.values())
      .reduce((sum, node) => sum + node.accessCount, 0);
    
    return total / level.nodes.size;
  }
  
  public getWisdomCache(): WisdomPacket[] {
    return [...this.wisdomCache];
  }
  
  public clearWisdomCache(): void {
    this.wisdomCache = [];
    logger.info('Wisdom cache cleared');
  }
  
  public exportMemory(): any {
    return {
      agentId: this.agentId,
      memoryLevels: Array.from(this.memoryLevels.entries()).map(([level, data]) => ({
        level,
        nodes: Array.from(data.nodes.values()),
        compressionThreshold: data.compressionThreshold
      })),
      clusters: Array.from(this.memoryClusters.values()),
      wisdom: this.wisdomCache,
      stats: this.getMemoryStats()
    };
  }
  
  public destroy(): void {
    this.removeAllListeners();
    this.memoryLevels.clear();
    this.memoryClusters.clear();
    this.nodeIndex.clear();
    this.wisdomCache = [];
    this.accessPatterns.clear();
    this.compressionQueue = [];
    
    logger.info(`FractalMemory destroyed for agent ${this.agentId}`);
  }
}