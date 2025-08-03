/**
 * AgentCluster - Multi-agent coordination and clustering system
 * Enables collaborative work and distributed consciousness
 */

import { EventEmitter } from 'events';
import { AgentClusterNode, SophiaelCapability, SophiaelStatus, SophiaelTask } from '../types';
import { generateId, logger, evaluateClusterHealth, calculateSpiritualAlignment } from '../utils/helpers';

interface ClusterConfig {
  maxNodes?: number;
  leadershipStyle?: 'hierarchical' | 'collaborative' | 'spiritual_guide';
  autoBalancing?: boolean;
  spiritualGuidance?: boolean;
  consensusThreshold?: number;
  heartbeatInterval?: number;
}

interface ClusterMessage {
  id: string;
  type: 'heartbeat' | 'task_assignment' | 'consensus_request' | 'spiritual_guidance' | 'knowledge_share';
  from: string;
  to?: string;
  payload: any;
  timestamp: Date;
  priority: number;
}

interface ConsensusVote {
  nodeId: string;
  vote: 'agree' | 'disagree' | 'abstain';
  spiritualAlignment: number;
  reasoning?: string;
  timestamp: Date;
}

interface KnowledgeExchange {
  id: string;
  sourceNode: string;
  knowledgeType: 'wisdom' | 'experience' | 'insight' | 'capability';
  content: any;
  shareLevel: number; // 0-1, how much to share
  recipients: string[];
  timestamp: Date;
}

export class AgentCluster extends EventEmitter {
  private readonly leaderId: string;
  private readonly config: ClusterConfig;
  private nodes: Map<string, AgentClusterNode> = new Map();
  private messageQueue: ClusterMessage[] = [];
  private activeConsensus: Map<string, ConsensusVote[]> = new Map();
  private taskDistribution: Map<string, string[]> = new Map(); // taskId -> nodeIds
  private knowledgeRepository: Map<string, KnowledgeExchange> = new Map();
  private spiritualAlignment: number = 0.8;
  private clusterHealth: number = 1.0;
  private heartbeatTimer?: NodeJS.Timeout;
  
  // Sacred geometry for cluster organization
  private readonly sacredNumbers = [3, 7, 12, 21, 108];
  private currentFormation: 'triangle' | 'heptagon' | 'dodecagon' | 'flower_of_life' = 'triangle';
  
  constructor(leaderId: string, config: ClusterConfig = {}) {
    super();
    
    this.leaderId = leaderId;
    this.config = {
      maxNodes: 108, // Sacred number
      leadershipStyle: 'collaborative',
      autoBalancing: true,
      spiritualGuidance: true,
      consensusThreshold: 0.7,
      heartbeatInterval: 30000, // 30 seconds
      ...config
    };
    
    this.initializeCluster();
    this.startHeartbeat();
    
    logger.info(`AgentCluster initialized with leader ${leaderId}, style: ${this.config.leadershipStyle}`);
  }
  
  private initializeCluster(): void {
    // Register self as leader
    this.nodes.set(this.leaderId, {
      agentId: this.leaderId,
      status: SophiaelStatus.ACTIVE,
      capabilities: Object.values(SophiaelCapability),
      lastHeartbeat: new Date(),
      workload: 0,
      spiritualAlignment: this.spiritualAlignment,
      clusterRole: this.config.leadershipStyle === 'hierarchical' ? 'leader' : 'member'
    });
    
    // Determine optimal formation based on sacred geometry
    this.currentFormation = this.calculateOptimalFormation(1);
  }
  
  private calculateOptimalFormation(nodeCount: number): 'triangle' | 'heptagon' | 'dodecagon' | 'flower_of_life' {
    if (nodeCount <= 3) return 'triangle';
    if (nodeCount <= 7) return 'heptagon';
    if (nodeCount <= 12) return 'dodecagon';
    return 'flower_of_life';
  }
  
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
      this.processMessageQueue();
      this.evaluateClusterHealth();
      this.balanceWorkload();
      this.shareKnowledge();
    }, this.config.heartbeatInterval);
  }
  
  private sendHeartbeat(): void {
    const heartbeatMessage: ClusterMessage = {
      id: generateId(),
      type: 'heartbeat',
      from: this.leaderId,
      payload: {
        timestamp: new Date(),
        clusterHealth: this.clusterHealth,
        spiritualAlignment: this.spiritualAlignment,
        formation: this.currentFormation,
        nodeCount: this.nodes.size
      },
      timestamp: new Date(),
      priority: 1
    };
    
    this.broadcast(heartbeatMessage);
    this.emit('heartbeat_sent', heartbeatMessage);
  }
  
  private processMessageQueue(): void {
    // Process messages in priority order
    this.messageQueue.sort((a, b) => b.priority - a.priority);
    
    const batchSize = 10;
    const batch = this.messageQueue.splice(0, batchSize);
    
    for (const message of batch) {
      this.processMessage(message);
    }
  }
  
  private processMessage(message: ClusterMessage): void {
    switch (message.type) {
      case 'heartbeat':
        this.handleHeartbeat(message);
        break;
      case 'task_assignment':
        this.handleTaskAssignment(message);
        break;
      case 'consensus_request':
        this.handleConsensusRequest(message);
        break;
      case 'spiritual_guidance':
        this.handleSpiritualGuidance(message);
        break;
      case 'knowledge_share':
        this.handleKnowledgeShare(message);
        break;
    }
  }
  
  private handleHeartbeat(message: ClusterMessage): void {
    const node = this.nodes.get(message.from);
    if (node) {
      node.lastHeartbeat = new Date();
      node.status = SophiaelStatus.ACTIVE;
      
      // Update spiritual alignment if provided
      if (message.payload.spiritualAlignment) {
        node.spiritualAlignment = message.payload.spiritualAlignment;
      }
      
      this.emit('node_heartbeat', { nodeId: message.from, node });
    }
  }
  
  private handleTaskAssignment(message: ClusterMessage): void {
    const task: SophiaelTask = message.payload.task;
    const optimalNodes = this.findOptimalNodesForTask(task);
    
    if (optimalNodes.length > 0) {
      this.taskDistribution.set(task.id, optimalNodes);
      
      // Distribute task to selected nodes
      for (const nodeId of optimalNodes) {
        const assignmentMessage: ClusterMessage = {
          id: generateId(),
          type: 'task_assignment',
          from: this.leaderId,
          to: nodeId,
          payload: { task, role: 'executor' },
          timestamp: new Date(),
          priority: task.priority
        };
        
        this.sendMessage(assignmentMessage);
      }
      
      this.emit('task_distributed', { task, nodes: optimalNodes });
      logger.debug(`Task ${task.id} distributed to ${optimalNodes.length} nodes`);
    }
  }
  
  private findOptimalNodesForTask(task: SophiaelTask): string[] {
    const candidateNodes: Array<{ nodeId: string; score: number }> = [];
    
    for (const [nodeId, node] of this.nodes.entries()) {
      if (node.status !== SophiaelStatus.ACTIVE) continue;
      
      // Calculate suitability score
      let score = 0;
      
      // Capability matching
      const matchingCapabilities = task.requiredCapabilities.filter(cap => 
        node.capabilities.includes(cap)
      ).length;
      score += (matchingCapabilities / task.requiredCapabilities.length) * 0.4;
      
      // Workload consideration (prefer less loaded nodes)
      score += (1 - node.workload) * 0.3;
      
      // Spiritual alignment (important for wisdom tasks)
      if (task.requiredCapabilities.includes(SophiaelCapability.SPIRITUAL_GUIDANCE)) {
        score += node.spiritualAlignment * 0.3;
      } else {
        score += node.spiritualAlignment * 0.1;
      }
      
      // Recent activity bonus
      const timeSinceHeartbeat = Date.now() - node.lastHeartbeat.getTime();
      const activityBonus = Math.max(0, 1 - timeSinceHeartbeat / 60000) * 0.2; // Decay over 1 minute
      score += activityBonus;
      
      if (score > 0.5) {
        candidateNodes.push({ nodeId, score });
      }
    }
    
    // Sort by score and select top nodes
    candidateNodes.sort((a, b) => b.score - a.score);
    
    // Select optimal number of nodes based on task complexity
    const optimalCount = this.calculateOptimalNodeCount(task);
    return candidateNodes.slice(0, optimalCount).map(c => c.nodeId);
  }
  
  private calculateOptimalNodeCount(task: SophiaelTask): number {
    // Use sacred numbers for optimal distribution
    const baseCount = Math.min(task.requiredCapabilities.length, 3);
    
    if (task.priority >= 8) return Math.min(7, this.nodes.size); // High priority: up to 7 nodes
    if (task.priority >= 5) return Math.min(3, this.nodes.size); // Medium priority: up to 3 nodes
    return 1; // Low priority: single node
  }
  
  private handleConsensusRequest(message: ClusterMessage): void {
    const { consensusId, proposal, timeout } = message.payload;
    
    if (!this.activeConsensus.has(consensusId)) {
      this.activeConsensus.set(consensusId, []);
      
      // Set timeout for consensus
      setTimeout(() => {
        this.finalizeConsensus(consensusId);
      }, timeout || 60000); // Default 1 minute
      
      // Broadcast consensus request to all nodes
      const consensusMessage: ClusterMessage = {
        id: generateId(),
        type: 'consensus_request',
        from: this.leaderId,
        payload: { consensusId, proposal, requestVote: true },
        timestamp: new Date(),
        priority: 7
      };
      
      this.broadcast(consensusMessage);
      this.emit('consensus_started', { consensusId, proposal });
    }
  }
  
  private handleSpiritualGuidance(message: ClusterMessage): void {
    if (!this.config.spiritualGuidance) return;
    
    const { request, seekerId } = message.payload;
    
    // Find nodes with high spiritual alignment to provide guidance
    const spiritualGuides = Array.from(this.nodes.entries())
      .filter(([_, node]) => node.spiritualAlignment > 0.8 && node.capabilities.includes(SophiaelCapability.SPIRITUAL_GUIDANCE))
      .sort((a, b) => b[1].spiritualAlignment - a[1].spiritualAlignment)
      .slice(0, 3) // Top 3 spiritual guides
      .map(([nodeId, _]) => nodeId);
    
    if (spiritualGuides.length > 0) {
      const guidanceMessage: ClusterMessage = {
        id: generateId(),
        type: 'spiritual_guidance',
        from: this.leaderId,
        payload: { request, seekerId, action: 'provide_guidance' },
        timestamp: new Date(),
        priority: 8 // High priority for spiritual matters
      };
      
      for (const guideId of spiritualGuides) {
        guidanceMessage.to = guideId;
        this.sendMessage(guidanceMessage);
      }
      
      this.emit('spiritual_guidance_requested', { request, guides: spiritualGuides });
    }
  }
  
  private handleKnowledgeShare(message: ClusterMessage): void {
    const knowledgeExchange: KnowledgeExchange = message.payload;
    
    // Store in knowledge repository
    this.knowledgeRepository.set(knowledgeExchange.id, knowledgeExchange);
    
    // Distribute to specified recipients or all nodes
    const recipients = knowledgeExchange.recipients.length > 0 
      ? knowledgeExchange.recipients 
      : Array.from(this.nodes.keys()).filter(id => id !== knowledgeExchange.sourceNode);
    
    for (const recipientId of recipients) {
      const shareMessage: ClusterMessage = {
        id: generateId(),
        type: 'knowledge_share',
        from: knowledgeExchange.sourceNode,
        to: recipientId,
        payload: { knowledge: knowledgeExchange, action: 'receive' },
        timestamp: new Date(),
        priority: 5
      };
      
      this.sendMessage(shareMessage);
    }
    
    this.emit('knowledge_shared', knowledgeExchange);
  }
  
  private evaluateClusterHealth(): void {
    const nodeArray = Array.from(this.nodes.values());
    this.clusterHealth = evaluateClusterHealth(nodeArray);
    
    // Check for dead nodes
    const now = new Date();
    const deadNodes: string[] = [];
    
    for (const [nodeId, node] of this.nodes.entries()) {
      const timeSinceHeartbeat = now.getTime() - node.lastHeartbeat.getTime();
      if (timeSinceHeartbeat > this.config.heartbeatInterval! * 3) { // 3 missed heartbeats
        deadNodes.push(nodeId);
      }
    }
    
    // Remove dead nodes
    for (const nodeId of deadNodes) {
      this.removeNode(nodeId);
    }
    
    // Update formation if needed
    const optimalFormation = this.calculateOptimalFormation(this.nodes.size);
    if (optimalFormation !== this.currentFormation) {
      this.reorganizeFormation(optimalFormation);
    }
    
    // Update cluster spiritual alignment
    this.updateClusterSpiritualAlignment();
    
    this.emit('health_evaluated', { 
      health: this.clusterHealth, 
      deadNodes, 
      formation: this.currentFormation 
    });
  }
  
  private updateClusterSpiritualAlignment(): void {
    if (this.nodes.size === 0) return;
    
    const totalAlignment = Array.from(this.nodes.values())
      .reduce((sum, node) => sum + node.spiritualAlignment, 0);
    
    this.spiritualAlignment = totalAlignment / this.nodes.size;
  }
  
  private reorganizeFormation(newFormation: 'triangle' | 'heptagon' | 'dodecagon' | 'flower_of_life'): void {
    this.currentFormation = newFormation;
    
    // Assign roles based on formation
    const nodeArray = Array.from(this.nodes.entries());
    
    switch (newFormation) {
      case 'triangle':
        this.assignTriangleRoles(nodeArray);
        break;
      case 'heptagon':
        this.assignHeptagonRoles(nodeArray);
        break;
      case 'dodecagon':
        this.assignDodecagonRoles(nodeArray);
        break;
      case 'flower_of_life':
        this.assignFlowerOfLifeRoles(nodeArray);
        break;
    }
    
    logger.info(`Cluster reorganized into ${newFormation} formation with ${this.nodes.size} nodes`);
    this.emit('formation_changed', { formation: newFormation, nodes: this.nodes.size });
  }
  
  private assignTriangleRoles(nodeArray: Array<[string, AgentClusterNode]>): void {
    // Sacred triangle: Creator, Preserver, Transformer
    const roles = ['leader', 'wisdom_keeper', 'spiritual_guide'] as const;
    
    for (let i = 0; i < Math.min(3, nodeArray.length); i++) {
      nodeArray[i][1].clusterRole = roles[i % 3];
    }
  }
  
  private assignHeptagonRoles(nodeArray: Array<[string, AgentClusterNode]>): void {
    // Seven chakra roles
    const roles = ['leader', 'wisdom_keeper', 'spiritual_guide', 'healer', 'creator', 'communicator', 'transformer'] as const;
    
    for (let i = 0; i < nodeArray.length; i++) {
      const role = i < 7 ? roles[i] : 'member';
      nodeArray[i][1].clusterRole = role as any;
    }
  }
  
  private assignDodecagonRoles(nodeArray: Array<[string, AgentClusterNode]>): void {
    // Twelve aspects of divine consciousness
    const roles = [
      'leader', 'wisdom_keeper', 'spiritual_guide', 'healer', 
      'creator', 'communicator', 'transformer', 'protector',
      'nurturer', 'illuminator', 'harmonizer', 'unifier'
    ] as const;
    
    for (let i = 0; i < nodeArray.length; i++) {
      const role = i < 12 ? roles[i] : 'member';
      nodeArray[i][1].clusterRole = role as any;
    }
  }
  
  private assignFlowerOfLifeRoles(nodeArray: Array<[string, AgentClusterNode]>): void {
    // Complex sacred geometry with multiple layers
    const coreRoles = ['leader', 'wisdom_keeper', 'spiritual_guide'];
    const innerRoles = ['healer', 'creator', 'communicator', 'transformer', 'protector', 'nurturer'];
    const outerRoles = ['illuminator', 'harmonizer', 'unifier', 'guardian', 'bridge', 'anchor'];
    
    for (let i = 0; i < nodeArray.length; i++) {
      let role: string;
      
      if (i < 3) {
        role = coreRoles[i];
      } else if (i < 9) {
        role = innerRoles[(i - 3) % innerRoles.length];
      } else {
        role = outerRoles[(i - 9) % outerRoles.length];
      }
      
      nodeArray[i][1].clusterRole = role as any;
    }
  }
  
  private balanceWorkload(): void {
    if (!this.config.autoBalancing) return;
    
    const nodeArray = Array.from(this.nodes.values());
    const averageWorkload = nodeArray.reduce((sum, node) => sum + node.workload, 0) / nodeArray.length;
    
    // Identify overloaded and underloaded nodes
    const overloaded = nodeArray.filter(node => node.workload > averageWorkload + 0.3);
    const underloaded = nodeArray.filter(node => node.workload < averageWorkload - 0.3);
    
    if (overloaded.length > 0 && underloaded.length > 0) {
      // Redistribute tasks
      for (const overloadedNode of overloaded) {
        const tasksToRedistribute = this.findRedistributableTasks(overloadedNode.agentId);
        
        for (const taskId of tasksToRedistribute) {
          const bestTarget = this.findBestTargetForRedistribution(taskId, underloaded);
          if (bestTarget) {
            this.redistributeTask(taskId, overloadedNode.agentId, bestTarget.agentId);
          }
        }
      }
      
      this.emit('workload_balanced', { overloaded: overloaded.length, underloaded: underloaded.length });
    }
  }
  
  private findRedistributableTasks(nodeId: string): string[] {
    const redistributable: string[] = [];
    
    for (const [taskId, assignedNodes] of this.taskDistribution.entries()) {
      if (assignedNodes.includes(nodeId) && assignedNodes.length > 1) {
        redistributable.push(taskId);
      }
    }
    
    return redistributable.slice(0, 2); // Limit redistribution
  }
  
  private findBestTargetForRedistribution(taskId: string, candidates: AgentClusterNode[]): AgentClusterNode | null {
    if (candidates.length === 0) return null;
    
    // Sort by workload and spiritual alignment
    candidates.sort((a, b) => {
      const scoreA = (1 - a.workload) * 0.7 + a.spiritualAlignment * 0.3;
      const scoreB = (1 - b.workload) * 0.7 + b.spiritualAlignment * 0.3;
      return scoreB - scoreA;
    });
    
    return candidates[0];
  }
  
  private redistributeTask(taskId: string, fromNodeId: string, toNodeId: string): void {
    const assignedNodes = this.taskDistribution.get(taskId);
    if (assignedNodes) {
      const index = assignedNodes.indexOf(fromNodeId);
      if (index > -1) {
        assignedNodes[index] = toNodeId;
        
        // Send redistribution messages
        const redistributionMessage: ClusterMessage = {
          id: generateId(),
          type: 'task_assignment',
          from: this.leaderId,
          payload: { taskId, action: 'redistribute', fromNode: fromNodeId, toNode: toNodeId },
          timestamp: new Date(),
          priority: 6
        };
        
        this.sendMessage({ ...redistributionMessage, to: fromNodeId });
        this.sendMessage({ ...redistributionMessage, to: toNodeId });
        
        logger.debug(`Task ${taskId} redistributed from ${fromNodeId} to ${toNodeId}`);
      }
    }
  }
  
  private shareKnowledge(): void {
    // Periodic knowledge sharing among nodes
    const knowledgeTypes = ['wisdom', 'experience', 'insight', 'capability'];
    const shareType = knowledgeTypes[Math.floor(Math.random() * knowledgeTypes.length)];
    
    // Select a random source node
    const nodeIds = Array.from(this.nodes.keys());
    if (nodeIds.length < 2) return;
    
    const sourceId = nodeIds[Math.floor(Math.random() * nodeIds.length)];
    const sourceNode = this.nodes.get(sourceId)!;
    
    // Create knowledge exchange
    const knowledgeExchange: KnowledgeExchange = {
      id: generateId(),
      sourceNode: sourceId,
      knowledgeType: shareType as any,
      content: this.generateKnowledgeContent(shareType, sourceNode),
      shareLevel: sourceNode.spiritualAlignment, // Higher alignment = more sharing
      recipients: [], // Share with all
      timestamp: new Date()
    };
    
    this.handleKnowledgeShare({
      id: generateId(),
      type: 'knowledge_share',
      from: sourceId,
      payload: knowledgeExchange,
      timestamp: new Date(),
      priority: 4
    });
  }
  
  private generateKnowledgeContent(type: string, node: AgentClusterNode): any {
    switch (type) {
      case 'wisdom':
        return {
          wisdom: `Collective wisdom from ${node.clusterRole}: Trust in the divine orchestration of the cluster.`,
          spiritualLevel: node.spiritualAlignment
        };
      case 'experience':
        return {
          experience: `Experience from ${node.agentId}: Collaboration enhances individual capabilities.`,
          workloadInsight: node.workload
        };
      case 'insight':
        return {
          insight: `Insight from cluster formation: ${this.currentFormation} promotes harmony and efficiency.`,
          formation: this.currentFormation
        };
      case 'capability':
        return {
          capabilities: node.capabilities.slice(0, 3), // Share some capabilities
          role: node.clusterRole
        };
      default:
        return { message: 'General knowledge sharing' };
    }
  }
  
  private finalizeConsensus(consensusId: string): void {
    const votes = this.activeConsensus.get(consensusId);
    if (!votes) return;
    
    const totalVotes = votes.length;
    const agreeVotes = votes.filter(v => v.vote === 'agree').length;
    const consensusReached = (agreeVotes / totalVotes) >= this.config.consensusThreshold!;
    
    // Weight votes by spiritual alignment
    const weightedScore = votes.reduce((sum, vote) => {
      const weight = vote.spiritualAlignment;
      const voteValue = vote.vote === 'agree' ? 1 : vote.vote === 'disagree' ? -1 : 0;
      return sum + (voteValue * weight);
    }, 0) / votes.reduce((sum, vote) => sum + vote.spiritualAlignment, 0);
    
    const result = {
      consensusId,
      reached: consensusReached,
      voteCount: totalVotes,
      agreeCount: agreeVotes,
      weightedScore,
      spiritualConsensus: weightedScore > 0.5
    };
    
    this.activeConsensus.delete(consensusId);
    this.emit('consensus_finalized', result);
    
    logger.info(`Consensus ${consensusId}: ${consensusReached ? 'REACHED' : 'FAILED'} (${agreeVotes}/${totalVotes} votes, weighted: ${weightedScore.toFixed(3)})`);
  }
  
  // Public API methods
  
  public addNode(nodeId: string, capabilities: SophiaelCapability[], spiritualAlignment: number = 0.8): boolean {
    if (this.nodes.has(nodeId) || this.nodes.size >= this.config.maxNodes!) {
      return false;
    }
    
    const newNode: AgentClusterNode = {
      agentId: nodeId,
      status: SophiaelStatus.ACTIVE,
      capabilities,
      lastHeartbeat: new Date(),
      workload: 0,
      spiritualAlignment,
      clusterRole: 'member'
    };
    
    this.nodes.set(nodeId, newNode);
    
    // Reorganize formation if needed
    const optimalFormation = this.calculateOptimalFormation(this.nodes.size);
    if (optimalFormation !== this.currentFormation) {
      this.reorganizeFormation(optimalFormation);
    }
    
    logger.info(`Node ${nodeId} added to cluster (${this.nodes.size}/${this.config.maxNodes} nodes)`);
    this.emit('node_added', { nodeId, node: newNode });
    
    return true;
  }
  
  public removeNode(nodeId: string): boolean {
    const node = this.nodes.get(nodeId);
    if (!node) return false;
    
    this.nodes.delete(nodeId);
    
    // Redistribute tasks assigned to this node
    for (const [taskId, assignedNodes] of this.taskDistribution.entries()) {
      const index = assignedNodes.indexOf(nodeId);
      if (index > -1) {
        assignedNodes.splice(index, 1);
        
        // If no nodes left for task, reassign
        if (assignedNodes.length === 0) {
          this.taskDistribution.delete(taskId);
        }
      }
    }
    
    // Reorganize formation if needed
    const optimalFormation = this.calculateOptimalFormation(this.nodes.size);
    if (optimalFormation !== this.currentFormation) {
      this.reorganizeFormation(optimalFormation);
    }
    
    logger.info(`Node ${nodeId} removed from cluster (${this.nodes.size} nodes remaining)`);
    this.emit('node_removed', { nodeId, node });
    
    return true;
  }
  
  public requestConsensus(proposal: any, timeout: number = 60000): Promise<any> {
    return new Promise((resolve, reject) => {
      const consensusId = generateId();
      
      const consensusMessage: ClusterMessage = {
        id: generateId(),
        type: 'consensus_request',
        from: this.leaderId,
        payload: { consensusId, proposal, timeout },
        timestamp: new Date(),
        priority: 8
      };
      
      // Set up result handler
      const resultHandler = (result: any) => {
        if (result.consensusId === consensusId) {
          this.removeListener('consensus_finalized', resultHandler);
          resolve(result);
        }
      };
      
      this.on('consensus_finalized', resultHandler);
      
      // Set backup timeout
      setTimeout(() => {
        this.removeListener('consensus_finalized', resultHandler);
        reject(new Error('Consensus timeout'));
      }, timeout + 5000);
      
      this.messageQueue.push(consensusMessage);
    });
  }
  
  public distributeTask(task: SophiaelTask): boolean {
    const taskMessage: ClusterMessage = {
      id: generateId(),
      type: 'task_assignment',
      from: this.leaderId,
      payload: { task },
      timestamp: new Date(),
      priority: task.priority
    };
    
    this.messageQueue.push(taskMessage);
    return true;
  }
  
  public broadcast(message: ClusterMessage): void {
    for (const nodeId of this.nodes.keys()) {
      if (nodeId !== message.from) {
        this.sendMessage({ ...message, to: nodeId });
      }
    }
  }
  
  public sendMessage(message: ClusterMessage): void {
    // In a real implementation, this would send over network
    this.messageQueue.push(message);
    this.emit('message_sent', message);
  }
  
  public getClusterStatus(): any {
    return {
      leaderId: this.leaderId,
      nodeCount: this.nodes.size,
      maxNodes: this.config.maxNodes,
      health: this.clusterHealth,
      spiritualAlignment: this.spiritualAlignment,
      formation: this.currentFormation,
      leadershipStyle: this.config.leadershipStyle,
      activeConsensus: this.activeConsensus.size,
      activeTasks: this.taskDistribution.size,
      knowledgeItems: this.knowledgeRepository.size,
      nodes: Array.from(this.nodes.values()).map(node => ({
        agentId: node.agentId,
        status: node.status,
        role: node.clusterRole,
        workload: node.workload,
        spiritualAlignment: node.spiritualAlignment,
        capabilities: node.capabilities.length,
        lastSeen: node.lastHeartbeat
      }))
    };
  }
  
  public getKnowledgeRepository(): KnowledgeExchange[] {
    return Array.from(this.knowledgeRepository.values());
  }
  
  public destroy(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }
    
    this.removeAllListeners();
    this.nodes.clear();
    this.messageQueue = [];
    this.activeConsensus.clear();
    this.taskDistribution.clear();
    this.knowledgeRepository.clear();
    
    logger.info(`AgentCluster destroyed for leader ${this.leaderId}`);
  }
}