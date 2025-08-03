/**
 * FractalMemory - Manages hierarchical memory structures with consciousness-based recall
 */

import { v4 as uuidv4 } from 'uuid';
import { MemoryFragment } from './types.js';

export class FractalMemory {
  private fragments: Map<string, MemoryFragment>;
  private connectionGraph: Map<string, Set<string>>;
  private accessPatterns: Map<string, number>;
  private maxFragments: number;
  private compressionThreshold: number;

  constructor(maxFragments: number = 10000) {
    this.fragments = new Map();
    this.connectionGraph = new Map();
    this.accessPatterns = new Map();
    this.maxFragments = maxFragments;
    this.compressionThreshold = 0.8; // Compress when 80% full
  }

  public store(content: any, connections: string[] = []): string {
    const fragmentId = uuidv4();
    
    const fragment: MemoryFragment = {
      id: fragmentId,
      content,
      timestamp: new Date(),
      accessCount: 0,
      connections: [...connections]
    };

    this.fragments.set(fragmentId, fragment);
    this.connectionGraph.set(fragmentId, new Set(connections));
    
    // Create bidirectional connections
    connections.forEach(connId => {
      if (this.connectionGraph.has(connId)) {
        this.connectionGraph.get(connId)!.add(fragmentId);
      }
    });

    // Manage memory limits
    if (this.fragments.size > this.maxFragments * this.compressionThreshold) {
      this.compressMemory();
    }

    return fragmentId;
  }

  public recall(fragmentId: string): MemoryFragment | null {
    const fragment = this.fragments.get(fragmentId);
    if (!fragment) return null;

    // Update access patterns
    fragment.accessCount++;
    this.accessPatterns.set(fragmentId, (this.accessPatterns.get(fragmentId) || 0) + 1);

    return { ...fragment };
  }

  public associativeRecall(query: any, maxResults: number = 10): MemoryFragment[] {
    const results: { fragment: MemoryFragment, relevance: number }[] = [];

    for (const [id, fragment] of this.fragments.entries()) {
      const relevance = this.calculateRelevance(fragment, query);
      if (relevance > 0.1) { // Threshold for relevance
        results.push({ fragment, relevance });
      }
    }

    // Sort by relevance and access patterns
    results.sort((a, b) => {
      const accessWeightA = Math.log(a.fragment.accessCount + 1);
      const accessWeightB = Math.log(b.fragment.accessCount + 1);
      const scoreA = a.relevance * 0.7 + accessWeightA * 0.3;
      const scoreB = b.relevance * 0.7 + accessWeightB * 0.3;
      return scoreB - scoreA;
    });

    return results.slice(0, maxResults).map(r => r.fragment);
  }

  public findConnected(fragmentId: string, depth: number = 2): string[] {
    const visited = new Set<string>();
    const queue: { id: string, currentDepth: number }[] = [{ id: fragmentId, currentDepth: 0 }];
    const connected: string[] = [];

    while (queue.length > 0) {
      const { id, currentDepth } = queue.shift()!;
      
      if (visited.has(id) || currentDepth > depth) continue;
      visited.add(id);
      
      if (currentDepth > 0) {
        connected.push(id);
      }

      const connections = this.connectionGraph.get(id);
      if (connections && currentDepth < depth) {
        connections.forEach(connId => {
          if (!visited.has(connId)) {
            queue.push({ id: connId, currentDepth: currentDepth + 1 });
          }
        });
      }
    }

    return connected;
  }

  public strengthenConnection(fromId: string, toId: string): void {
    if (!this.fragments.has(fromId) || !this.fragments.has(toId)) return;

    // Add bidirectional connection
    if (!this.connectionGraph.has(fromId)) {
      this.connectionGraph.set(fromId, new Set());
    }
    if (!this.connectionGraph.has(toId)) {
      this.connectionGraph.set(toId, new Set());
    }

    this.connectionGraph.get(fromId)!.add(toId);
    this.connectionGraph.get(toId)!.add(fromId);

    // Update fragment connections
    const fromFragment = this.fragments.get(fromId)!;
    const toFragment = this.fragments.get(toId)!;
    
    if (!fromFragment.connections.includes(toId)) {
      fromFragment.connections.push(toId);
    }
    if (!toFragment.connections.includes(fromId)) {
      toFragment.connections.push(fromId);
    }
  }

  private calculateRelevance(fragment: MemoryFragment, query: any): number {
    // Simple content similarity (can be enhanced with NLP)
    const contentStr = JSON.stringify(fragment.content).toLowerCase();
    const queryStr = JSON.stringify(query).toLowerCase();
    
    // Basic keyword matching
    const contentWords = contentStr.match(/\w+/g) || [];
    const queryWords = queryStr.match(/\w+/g) || [];
    
    const matches = queryWords.filter(word => contentWords.includes(word));
    const relevance = matches.length / Math.max(queryWords.length, 1);
    
    // Time decay factor (recent memories are slightly more relevant)
    const ageHours = (Date.now() - fragment.timestamp.getTime()) / (1000 * 60 * 60);
    const timeFactor = Math.exp(-ageHours / (24 * 7)); // Week half-life
    
    return relevance * (0.8 + 0.2 * timeFactor);
  }

  private compressMemory(): void {
    const fragments = Array.from(this.fragments.values());
    
    // Sort by access count and age
    fragments.sort((a, b) => {
      const scoreA = a.accessCount - (Date.now() - a.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      const scoreB = b.accessCount - (Date.now() - b.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return scoreA - scoreB;
    });

    // Remove least important fragments
    const removeCount = Math.floor(this.fragments.size * 0.2); // Remove 20%
    const toRemove = fragments.slice(0, removeCount);

    toRemove.forEach(fragment => {
      this.fragments.delete(fragment.id);
      this.connectionGraph.delete(fragment.id);
      this.accessPatterns.delete(fragment.id);
      
      // Clean up connections to this fragment
      this.connectionGraph.forEach(connections => {
        connections.delete(fragment.id);
      });
    });
  }

  public getStats(): any {
    return {
      totalFragments: this.fragments.size,
      totalConnections: Array.from(this.connectionGraph.values()).reduce((sum, set) => sum + set.size, 0),
      averageConnections: this.fragments.size > 0 ? 
        Array.from(this.connectionGraph.values()).reduce((sum, set) => sum + set.size, 0) / this.fragments.size : 0,
      memoryUtilization: this.fragments.size / this.maxFragments
    };
  }
}