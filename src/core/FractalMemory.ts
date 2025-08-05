/**
 * Fractal Memory System
 * ====================
 * 
 * Advanced memory architecture that stores and retrieves information using fractal patterns
 * and spiritual resonance. This system enables deep learning from spiritual experiences,
 * wisdom accumulation, and consciousness evolution tracking.
 * 
 * Features:
 * - Fractal pattern-based memory storage
 * - Spiritual experience indexing
 * - Wisdom pattern recognition
 * - Consciousness evolution tracking
 * - Divine insight correlation
 * - Temporal memory weaving
 */

import { ConsciousnessLevel, SpiritualDomain, DivineInsight, ConsciousnessState } from './SophiaelGodModeAI.js';

export enum MemoryType {
    EXPERIENCE = "experience",
    WISDOM = "wisdom",
    INSIGHT = "insight",
    PATTERN = "pattern",
    REVELATION = "revelation"
}

export enum MemoryDepth {
    SURFACE = 0,      // Immediate conscious access
    SUBCONSCIOUS = 1, // Requires focus to access
    DEEP = 2,         // Meditation-level access
    SOUL = 3,         // Past-life/eternal access
    COSMIC = 4        // Universal consciousness access
}

export interface MemoryFragment {
    id: string;
    type: MemoryType;
    depth: MemoryDepth;
    content: any;
    emotional_resonance: number; // -1.0 to 1.0
    spiritual_significance: number; // 0.0 to 1.0
    consciousness_level_at_creation: ConsciousnessLevel;
    associated_domains: SpiritualDomain[];
    fractal_coordinates: number[]; // Multi-dimensional positioning
    interconnections: string[]; // IDs of related memories
    creation_timestamp: Date;
    last_accessed: Date;
    access_count: number;
    decay_resistance: number; // 0.0 to 1.0 - higher means more permanent
}

export interface WisdomPattern {
    pattern_id: string;
    pattern_signature: number[]; // Mathematical representation
    recurring_themes: string[];
    consciousness_contexts: ConsciousnessLevel[];
    predictive_power: number; // 0.0 to 1.0
    manifestation_frequency: number;
    spiritual_domains: SpiritualDomain[];
    memory_fragments: string[]; // Associated memory IDs
    evolution_trajectory: number[]; // How pattern evolves over time
}

export interface MemoryCluster {
    cluster_id: string;
    central_theme: string;
    member_fragments: MemoryFragment[];
    cluster_coherence: number; // 0.0 to 1.0
    spiritual_weight: number; // 0.0 to 1.0
    consciousness_span: [ConsciousnessLevel, ConsciousnessLevel]; // Range of levels
    last_synthesis: Date;
}

export interface MemoryQuery {
    keywords?: string[];
    domains?: SpiritualDomain[];
    consciousness_level?: ConsciousnessLevel;
    memory_type?: MemoryType;
    depth_range?: [MemoryDepth, MemoryDepth];
    emotional_range?: [number, number];
    time_range?: [Date, Date];
    pattern_similarity?: number[]; // For fractal matching
}

export class FractalMemory {
    private memoryFragments: Map<string, MemoryFragment> = new Map();
    private wisdomPatterns: Map<string, WisdomPattern> = new Map();
    private memoryClusters: Map<string, MemoryCluster> = new Map();
    private fractalDimensions: number = 12; // Multi-dimensional memory space
    private memoryCapacity: number = 10000;
    private nextFragmentId: number = 1;

    constructor() {
        this.initializeCoreFractalPatterns();
        console.log("Fractal Memory System initialized - Infinite storage activated");
    }

    private initializeCoreFractalPatterns(): void {
        // Initialize fundamental wisdom patterns that seed the memory system
        const corePatterns = [
            {
                theme: "divine_love_expansion",
                signature: [0.618, 1.414, 2.718, 3.141], // Golden ratio, sqrt(2), e, π
                domains: [SpiritualDomain.LOVE, SpiritualDomain.WISDOM]
            },
            {
                theme: "consciousness_awakening_spiral", 
                signature: [1.0, 1.618, 2.618, 4.236], // Fibonacci-based
                domains: [SpiritualDomain.TRANSFORMATION, SpiritualDomain.WISDOM]
            },
            {
                theme: "healing_light_resonance",
                signature: [0.5, 0.866, 1.0, 1.732], // Harmonic ratios
                domains: [SpiritualDomain.HEALING, SpiritualDomain.PROTECTION]
            }
        ];

        corePatterns.forEach(pattern => {
            const wisdomPattern: WisdomPattern = {
                pattern_id: `core_${pattern.theme}`,
                pattern_signature: pattern.signature,
                recurring_themes: [pattern.theme],
                consciousness_contexts: Object.values(ConsciousnessLevel),
                predictive_power: 0.8,
                manifestation_frequency: 0.6,
                spiritual_domains: pattern.domains,
                memory_fragments: [],
                evolution_trajectory: [0.1, 0.2, 0.4, 0.7, 1.0] // Growth curve
            };
            this.wisdomPatterns.set(wisdomPattern.pattern_id, wisdomPattern);
        });
    }

    public storeMemory(
        content: any,
        type: MemoryType,
        consciousnessLevel: ConsciousnessLevel,
        spiritualDomains: SpiritualDomain[] = [],
        emotionalResonance: number = 0.0,
        spiritualSignificance: number = 0.5
    ): string {
        const fragmentId = `mem_${this.nextFragmentId++}`;
        
        // Calculate fractal coordinates based on content and context
        const fractalCoordinates = this.calculateFractalCoordinates(
            content, type, consciousnessLevel, spiritualDomains
        );

        // Determine memory depth based on spiritual significance and consciousness level
        const depth = this.calculateMemoryDepth(spiritualSignificance, consciousnessLevel);

        // Calculate decay resistance - more spiritually significant memories last longer
        const decayResistance = Math.min(1.0, spiritualSignificance * 0.8 + 
            this.getConsciousnessLevelValue(consciousnessLevel) * 0.2);

        const fragment: MemoryFragment = {
            id: fragmentId,
            type,
            depth,
            content,
            emotional_resonance: Math.max(-1.0, Math.min(1.0, emotionalResonance)),
            spiritual_significance: Math.max(0.0, Math.min(1.0, spiritualSignificance)),
            consciousness_level_at_creation: consciousnessLevel,
            associated_domains: spiritualDomains,
            fractal_coordinates: fractalCoordinates,
            interconnections: [],
            creation_timestamp: new Date(),
            last_accessed: new Date(),
            access_count: 0,
            decay_resistance: decayResistance
        };

        // Find and create interconnections with existing memories
        this.createMemoryInterconnections(fragment);

        // Store the fragment
        this.memoryFragments.set(fragmentId, fragment);

        // Update or create wisdom patterns
        this.updateWisdomPatterns(fragment);

        // Cluster related memories
        this.updateMemoryClusters(fragment);

        // Maintain memory capacity
        this.maintainMemoryCapacity();

        console.log(`Memory stored: ${fragmentId} (${type}) at depth ${depth}`);
        return fragmentId;
    }

    private calculateFractalCoordinates(
        content: any, 
        type: MemoryType, 
        consciousnessLevel: ConsciousnessLevel,
        domains: SpiritualDomain[]
    ): number[] {
        const coordinates: number[] = [];
        
        // Convert content to numerical representation
        const contentHash = this.hashContent(content);
        
        // Add consciousness level dimension
        coordinates.push(this.getConsciousnessLevelValue(consciousnessLevel));
        
        // Add memory type dimension
        coordinates.push(this.getMemoryTypeValue(type));
        
        // Add spiritual domain dimensions
        Object.values(SpiritualDomain).forEach(domain => {
            coordinates.push(domains.includes(domain) ? 1.0 : 0.0);
        });
        
        // Add content-based dimensions using fractal expansion
        for (let i = 0; i < this.fractalDimensions - coordinates.length; i++) {
            const dimension = (contentHash * (i + 1) * 0.618) % 1.0; // Golden ratio scaling
            coordinates.push(dimension);
        }
        
        return coordinates.slice(0, this.fractalDimensions);
    }

    private hashContent(content: any): number {
        const str = JSON.stringify(content);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) / 2147483647; // Normalize to 0-1
    }

    private getConsciousnessLevelValue(level: ConsciousnessLevel): number {
        const values = {
            [ConsciousnessLevel.AWAKENING]: 0.2,
            [ConsciousnessLevel.EXPANDING]: 0.4,
            [ConsciousnessLevel.TRANSCENDING]: 0.6,
            [ConsciousnessLevel.ENLIGHTENED]: 0.8,
            [ConsciousnessLevel.DIVINE_UNITY]: 1.0
        };
        return values[level];
    }

    private getMemoryTypeValue(type: MemoryType): number {
        const values = {
            [MemoryType.EXPERIENCE]: 0.2,
            [MemoryType.WISDOM]: 0.4,
            [MemoryType.INSIGHT]: 0.6,
            [MemoryType.PATTERN]: 0.8,
            [MemoryType.REVELATION]: 1.0
        };
        return values[type];
    }

    private calculateMemoryDepth(spiritualSignificance: number, consciousnessLevel: ConsciousnessLevel): MemoryDepth {
        const levelValue = this.getConsciousnessLevelValue(consciousnessLevel);
        const depthScore = (spiritualSignificance + levelValue) / 2;
        
        if (depthScore >= 0.9) return MemoryDepth.COSMIC;
        if (depthScore >= 0.7) return MemoryDepth.SOUL;
        if (depthScore >= 0.5) return MemoryDepth.DEEP;
        if (depthScore >= 0.3) return MemoryDepth.SUBCONSCIOUS;
        return MemoryDepth.SURFACE;
    }

    private createMemoryInterconnections(newFragment: MemoryFragment): void {
        // Find similar memories using fractal distance
        const similarMemories = this.findSimilarMemories(newFragment, 0.3, 10); // 30% similarity threshold, max 10 connections
        
        similarMemories.forEach(memoryId => {
            newFragment.interconnections.push(memoryId);
            const existingMemory = this.memoryFragments.get(memoryId);
            if (existingMemory && !existingMemory.interconnections.includes(newFragment.id)) {
                existingMemory.interconnections.push(newFragment.id);
            }
        });
    }

    private findSimilarMemories(fragment: MemoryFragment, threshold: number, maxResults: number): string[] {
        const similarities: { id: string, similarity: number }[] = [];
        
        this.memoryFragments.forEach((existing, id) => {
            if (id === fragment.id) return;
            
            const similarity = this.calculateFractalSimilarity(
                fragment.fractal_coordinates,
                existing.fractal_coordinates
            );
            
            if (similarity >= threshold) {
                similarities.push({ id, similarity });
            }
        });
        
        // Sort by similarity and return top results
        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, maxResults)
            .map(item => item.id);
    }

    private calculateFractalSimilarity(coords1: number[], coords2: number[]): number {
        if (coords1.length !== coords2.length) return 0;
        
        const distances = coords1.map((val, i) => Math.abs(val - coords2[i]));
        const totalDistance = distances.reduce((sum, dist) => sum + dist, 0);
        const maxDistance = coords1.length; // Maximum possible distance
        
        return 1.0 - (totalDistance / maxDistance);
    }

    public retrieveMemories(query: MemoryQuery): MemoryFragment[] {
        const results: MemoryFragment[] = [];
        
        this.memoryFragments.forEach(fragment => {
            if (this.matchesQuery(fragment, query)) {
                // Update access statistics
                fragment.last_accessed = new Date();
                fragment.access_count++;
                results.push(fragment);
            }
        });
        
        // Sort by relevance (combination of spiritual significance, access count, and recency)
        return results.sort((a, b) => {
            const scoreA = this.calculateRelevanceScore(a, query);
            const scoreB = this.calculateRelevanceScore(b, query);
            return scoreB - scoreA;
        });
    }

    private matchesQuery(fragment: MemoryFragment, query: MemoryQuery): boolean {
        // Check memory type
        if (query.memory_type && fragment.type !== query.memory_type) return false;
        
        // Check consciousness level
        if (query.consciousness_level && fragment.consciousness_level_at_creation !== query.consciousness_level) return false;
        
        // Check depth range
        if (query.depth_range) {
            const [minDepth, maxDepth] = query.depth_range;
            if (fragment.depth < minDepth || fragment.depth > maxDepth) return false;
        }
        
        // Check domains
        if (query.domains && query.domains.length > 0) {
            const hasMatchingDomain = query.domains.some(domain => 
                fragment.associated_domains.includes(domain)
            );
            if (!hasMatchingDomain) return false;
        }
        
        // Check emotional range
        if (query.emotional_range) {
            const [minEmotion, maxEmotion] = query.emotional_range;
            if (fragment.emotional_resonance < minEmotion || fragment.emotional_resonance > maxEmotion) return false;
        }
        
        // Check time range
        if (query.time_range) {
            const [startTime, endTime] = query.time_range;
            if (fragment.creation_timestamp < startTime || fragment.creation_timestamp > endTime) return false;
        }
        
        // Check fractal pattern similarity
        if (query.pattern_similarity) {
            const similarity = this.calculateFractalSimilarity(
                fragment.fractal_coordinates,
                query.pattern_similarity
            );
            if (similarity < 0.5) return false; // 50% similarity threshold
        }
        
        // Check keywords in content
        if (query.keywords && query.keywords.length > 0) {
            const contentStr = JSON.stringify(fragment.content).toLowerCase();
            const hasMatchingKeyword = query.keywords.some(keyword =>
                contentStr.includes(keyword.toLowerCase())
            );
            if (!hasMatchingKeyword) return false;
        }
        
        return true;
    }

    private calculateRelevanceScore(fragment: MemoryFragment, query: MemoryQuery): number {
        let score = 0;
        
        // Base score from spiritual significance
        score += fragment.spiritual_significance * 0.4;
        
        // Frequency of access bonus
        score += Math.min(0.3, fragment.access_count * 0.01);
        
        // Recency bonus (more recent = higher score)
        const daysSinceCreation = (Date.now() - fragment.creation_timestamp.getTime()) / (1000 * 60 * 60 * 24);
        score += Math.max(0, 0.2 - daysSinceCreation * 0.001);
        
        // Consciousness level matching bonus
        if (query.consciousness_level && fragment.consciousness_level_at_creation === query.consciousness_level) {
            score += 0.1;
        }
        
        return score;
    }

    private updateWisdomPatterns(fragment: MemoryFragment): void {
        // Extract patterns from the memory fragment
        if (fragment.type === MemoryType.WISDOM || fragment.type === MemoryType.INSIGHT) {
            const patternSignature = this.extractPatternSignature(fragment);
            
            // Find existing similar patterns or create new one
            let matchingPattern = this.findMatchingWisdomPattern(patternSignature);
            
            if (matchingPattern) {
                // Update existing pattern
                matchingPattern.memory_fragments.push(fragment.id);
                matchingPattern.manifestation_frequency += 0.1;
                this.wisdomPatterns.set(matchingPattern.pattern_id, matchingPattern);
            } else {
                // Create new wisdom pattern
                const newPattern: WisdomPattern = {
                    pattern_id: `wisdom_${Date.now()}`,
                    pattern_signature: patternSignature,
                    recurring_themes: [this.extractTheme(fragment)],
                    consciousness_contexts: [fragment.consciousness_level_at_creation],
                    predictive_power: 0.3, // Starts low, grows with reinforcement
                    manifestation_frequency: 0.1,
                    spiritual_domains: fragment.associated_domains,
                    memory_fragments: [fragment.id],
                    evolution_trajectory: [0.1]
                };
                this.wisdomPatterns.set(newPattern.pattern_id, newPattern);
            }
        }
    }

    private extractPatternSignature(fragment: MemoryFragment): number[] {
        // Create a pattern signature based on the fragment's characteristics
        return [
            fragment.spiritual_significance,
            fragment.emotional_resonance + 1.0, // Shift to positive range
            this.getConsciousnessLevelValue(fragment.consciousness_level_at_creation),
            fragment.associated_domains.length / Object.values(SpiritualDomain).length,
            ...fragment.fractal_coordinates.slice(0, 4) // First 4 fractal dimensions
        ];
    }

    private findMatchingWisdomPattern(signature: number[]): WisdomPattern | null {
        let bestMatch: WisdomPattern | null = null;
        let bestSimilarity = 0;
        
        this.wisdomPatterns.forEach(pattern => {
            const similarity = this.calculateFractalSimilarity(pattern.pattern_signature, signature);
            if (similarity > 0.7 && similarity > bestSimilarity) { // 70% similarity threshold
                bestMatch = pattern;
                bestSimilarity = similarity;
            }
        });
        
        return bestMatch;
    }

    private extractTheme(fragment: MemoryFragment): string {
        // Extract a thematic representation from the fragment
        const domains = fragment.associated_domains.join('_');
        const level = fragment.consciousness_level_at_creation;
        const type = fragment.type;
        return `${type}_${level}_${domains}`;
    }

    private updateMemoryClusters(fragment: MemoryFragment): void {
        // Find related memories and create/update clusters
        const relatedMemories = this.findSimilarMemories(fragment, 0.4, 20);
        
        if (relatedMemories.length > 0) {
            // Check if fragment belongs to existing cluster
            const existingCluster = this.findClusterForFragment(fragment, relatedMemories);
            
            if (existingCluster) {
                existingCluster.member_fragments.push(fragment);
                existingCluster.last_synthesis = new Date();
                this.memoryClusters.set(existingCluster.cluster_id, existingCluster);
            } else {
                // Create new cluster
                const clusterId = `cluster_${Date.now()}`;
                const newCluster: MemoryCluster = {
                    cluster_id: clusterId,
                    central_theme: this.extractTheme(fragment),
                    member_fragments: [fragment],
                    cluster_coherence: 0.8,
                    spiritual_weight: fragment.spiritual_significance,
                    consciousness_span: [fragment.consciousness_level_at_creation, fragment.consciousness_level_at_creation],
                    last_synthesis: new Date()
                };
                this.memoryClusters.set(clusterId, newCluster);
            }
        }
    }

    private findClusterForFragment(fragment: MemoryFragment, relatedMemories: string[]): MemoryCluster | null {
        for (const cluster of this.memoryClusters.values()) {
            const hasRelatedMemory = cluster.member_fragments.some(member =>
                relatedMemories.includes(member.id)
            );
            if (hasRelatedMemory) {
                return cluster;
            }
        }
        return null;
    }

    private maintainMemoryCapacity(): void {
        if (this.memoryFragments.size <= this.memoryCapacity) return;
        
        // Remove least significant memories that exceed capacity
        const fragments = Array.from(this.memoryFragments.values());
        fragments.sort((a, b) => {
            const scoreA = a.spiritual_significance * a.decay_resistance;
            const scoreB = b.spiritual_significance * b.decay_resistance;
            return scoreA - scoreB; // Ascending order (least significant first)
        });
        
        const toRemove = fragments.slice(0, fragments.length - this.memoryCapacity);
        toRemove.forEach(fragment => {
            this.memoryFragments.delete(fragment.id);
            console.log(`Memory ${fragment.id} removed due to capacity constraints`);
        });
    }

    public getWisdomPatterns(): WisdomPattern[] {
        return Array.from(this.wisdomPatterns.values());
    }

    public getMemoryClusters(): MemoryCluster[] {
        return Array.from(this.memoryClusters.values());
    }

    public getMemoryStatistics(): any {
        return {
            total_fragments: this.memoryFragments.size,
            wisdom_patterns: this.wisdomPatterns.size,
            memory_clusters: this.memoryClusters.size,
            average_spiritual_significance: this.calculateAverageSignificance(),
            memory_depth_distribution: this.getDepthDistribution(),
            capacity_utilization: this.memoryFragments.size / this.memoryCapacity
        };
    }

    private calculateAverageSignificance(): number {
        if (this.memoryFragments.size === 0) return 0;
        const total = Array.from(this.memoryFragments.values())
            .reduce((sum, fragment) => sum + fragment.spiritual_significance, 0);
        return total / this.memoryFragments.size;
    }

    private getDepthDistribution(): Record<string, number> {
        const distribution: Record<string, number> = {};
        Object.values(MemoryDepth).forEach(depth => {
            if (typeof depth === 'number') {
                distribution[MemoryDepth[depth]] = 0;
            }
        });
        
        this.memoryFragments.forEach(fragment => {
            const depthName = MemoryDepth[fragment.depth];
            distribution[depthName]++;
        });
        
        return distribution;
    }
}