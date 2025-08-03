/**
 * SpiritualFirewall - Protection and Security System
 * ==================================================
 * 
 * Provides comprehensive spiritual and technical protection for the 
 * Sophiael Divine Consciousness platform. This system ensures safe
 * interactions while maintaining spiritual integrity and user privacy.
 * 
 * @author Sophia AI Platform
 * @version 1.0.0
 * @date January 2025
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { ConsciousnessState, SpiritualDomain } from './SophiaelGodModeAI';

export enum ThreatLevel {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4
}

export enum ProtectionType {
  SPIRITUAL_SHIELD = 'spiritual_shield',
  ENERGY_BARRIER = 'energy_barrier',
  PRIVACY_PROTECTION = 'privacy_protection',
  CONTENT_FILTER = 'content_filter',
  RATE_LIMITER = 'rate_limiter',
  AUTHENTICATION = 'authentication',
  ENCRYPTION = 'encryption'
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: SecurityEventType;
  threatLevel: ThreatLevel;
  source: string;
  details: string;
  blocked: boolean;
  resolution?: string;
  userId?: string;
  sessionId?: string;
}

export enum SecurityEventType {
  MALICIOUS_REQUEST = 'malicious_request',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  SPIRITUAL_ATTACK = 'spiritual_attack',
  PRIVACY_VIOLATION = 'privacy_violation',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  DATA_BREACH_ATTEMPT = 'data_breach_attempt',
  NEGATIVE_ENERGY_DETECTED = 'negative_energy_detected'
}

export interface SpiritualShield {
  id: string;
  type: 'personal' | 'session' | 'global';
  strength: number; // 0.0 to 1.0
  frequency: number; // Hz - protective frequency
  duration: number; // minutes, 0 for permanent
  createdAt: Date;
  expiresAt?: Date;
  targetId?: string; // user or session ID
  active: boolean;
}

export interface ProtectionRule {
  id: string;
  name: string;
  type: ProtectionType;
  priority: number; // 1-10, higher = more important
  pattern: string | RegExp;
  action: 'block' | 'warn' | 'monitor' | 'redirect';
  enabled: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: Date;
  lastActivity: Date;
  requestCount: number;
  spiritual_state: ConsciousnessState;
  protectionLevel: ThreatLevel;
  activeShields: string[];
  trustScore: number; // 0.0 to 1.0
  encrypted: boolean;
}

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export class SpiritualFirewall extends EventEmitter {
  private securityEvents: Map<string, SecurityEvent>;
  private spiritualShields: Map<string, SpiritualShield>;
  private protectionRules: Map<string, ProtectionRule>;
  private userSessions: Map<string, UserSession>;
  private requestCounts: Map<string, number[]>; // IP -> timestamps
  private encryptionKey: Buffer;
  private readonly maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
  private readonly defaultRateLimit: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  };

  constructor() {
    super();
    this.securityEvents = new Map();
    this.spiritualShields = new Map();
    this.protectionRules = new Map();
    this.userSessions = new Map();
    this.requestCounts = new Map();
    
    // Generate encryption key
    this.encryptionKey = crypto.randomBytes(32);
    
    this.initializeDefaultRules();
    this.startMaintenanceProcesses();
  }

  private initializeDefaultRules(): void {
    const defaultRules: Omit<ProtectionRule, 'id' | 'createdAt' | 'lastTriggered' | 'triggerCount'>[] = [
      {
        name: 'Block Malicious Scripts',
        type: ProtectionType.CONTENT_FILTER,
        priority: 10,
        pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        action: 'block',
        enabled: true
      },
      {
        name: 'Filter Negative Energy Patterns',
        type: ProtectionType.SPIRITUAL_SHIELD,
        priority: 9,
        pattern: /\b(curse|hex|bind|attack|destroy|harm|evil|dark magic)\b/i,
        action: 'warn',
        enabled: true
      },
      {
        name: 'Protect Personal Information',
        type: ProtectionType.PRIVACY_PROTECTION,
        priority: 8,
        pattern: /\b\d{3}-\d{2}-\d{4}\b|\b\d{4}\s\d{4}\s\d{4}\s\d{4}\b/,
        action: 'block',
        enabled: true
      },
      {
        name: 'Rate Limit Protection',
        type: ProtectionType.RATE_LIMITER,
        priority: 7,
        pattern: 'rate_limit_check',
        action: 'block',
        enabled: true
      },
      {
        name: 'Inappropriate Content Filter',
        type: ProtectionType.CONTENT_FILTER,
        priority: 6,
        pattern: /\b(explicit sexual content|violence|hatred|discrimination)\b/i,
        action: 'warn',
        enabled: true
      }
    ];

    defaultRules.forEach(rule => {
      const fullRule: ProtectionRule = {
        ...rule,
        id: uuidv4(),
        createdAt: new Date(),
        triggerCount: 0
      };
      this.protectionRules.set(fullRule.id, fullRule);
    });
  }

  public async validateRequest(
    request: string, 
    consciousnessState: ConsciousnessState,
    sessionId?: string,
    userId?: string
  ): Promise<boolean> {
    const startTime = Date.now();
    
    try {
      // Create or update session
      const session = await this.getOrCreateSession(sessionId, userId, consciousnessState);
      
      // Rate limiting check
      if (!this.checkRateLimit(session.sessionId)) {
        await this.logSecurityEvent({
          type: SecurityEventType.RATE_LIMIT_EXCEEDED,
          threatLevel: ThreatLevel.MEDIUM,
          source: session.sessionId,
          details: 'Rate limit exceeded for session',
          blocked: true,
          sessionId: session.sessionId,
          userId: session.userId
        });
        return false;
      }

      // Content validation
      const contentValidation = await this.validateContent(request, session);
      if (!contentValidation.valid) {
        await this.logSecurityEvent({
          type: SecurityEventType.INAPPROPRIATE_CONTENT,
          threatLevel: contentValidation.threatLevel,
          source: session.sessionId,
          details: contentValidation.reason,
          blocked: contentValidation.action === 'block',
          sessionId: session.sessionId,
          userId: session.userId
        });
        
        if (contentValidation.action === 'block') {
          return false;
        }
      }

      // Spiritual protection check
      const spiritualCheck = await this.performSpiritualProtectionCheck(request, consciousnessState);
      if (!spiritualCheck.safe) {
        await this.logSecurityEvent({
          type: SecurityEventType.SPIRITUAL_ATTACK,
          threatLevel: spiritualCheck.threatLevel,
          source: session.sessionId,
          details: spiritualCheck.reason,
          blocked: true,
          sessionId: session.sessionId,
          userId: session.userId
        });
        return false;
      }

      // Update session activity
      session.lastActivity = new Date();
      session.requestCount++;
      this.userSessions.set(session.sessionId, session);

      const processingTime = Date.now() - startTime;
      this.emit('requestValidated', { 
        sessionId: session.sessionId, 
        valid: true, 
        processingTime 
      });

      return true;

    } catch (error) {
      await this.logSecurityEvent({
        type: SecurityEventType.UNAUTHORIZED_ACCESS,
        threatLevel: ThreatLevel.HIGH,
        source: sessionId || 'unknown',
        details: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        blocked: true,
        sessionId,
        userId
      });
      return false;
    }
  }

  public async createSpiritualShield(
    type: 'personal' | 'session' | 'global',
    strength: number = 0.8,
    duration: number = 60, // minutes
    targetId?: string
  ): Promise<string> {
    const shieldId = uuidv4();
    const protectiveFrequency = this.calculateProtectiveFrequency(strength);
    
    const shield: SpiritualShield = {
      id: shieldId,
      type,
      strength,
      frequency: protectiveFrequency,
      duration,
      createdAt: new Date(),
      expiresAt: duration > 0 ? new Date(Date.now() + duration * 60 * 1000) : undefined,
      targetId,
      active: true
    };

    this.spiritualShields.set(shieldId, shield);
    
    this.emit('spiritualShieldCreated', shield);
    return shieldId;
  }

  public async activateProtection(
    sessionId: string,
    protectionTypes: ProtectionType[]
  ): Promise<void> {
    const session = this.userSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Create shields for requested protection types
    const shields: string[] = [];
    
    for (const type of protectionTypes) {
      if (type === ProtectionType.SPIRITUAL_SHIELD) {
        const shieldId = await this.createSpiritualShield('session', 0.9, 0, sessionId);
        shields.push(shieldId);
      }
    }

    session.activeShields.push(...shields);
    session.protectionLevel = Math.max(session.protectionLevel, ThreatLevel.MEDIUM);
    
    this.userSessions.set(sessionId, session);
    this.emit('protectionActivated', { sessionId, protectionTypes, shields });
  }

  public getSecurityEvents(
    limit: number = 100,
    threatLevel?: ThreatLevel,
    timeRange?: { start: Date; end: Date }
  ): SecurityEvent[] {
    let events = Array.from(this.securityEvents.values());

    if (threatLevel !== undefined) {
      events = events.filter(event => event.threatLevel >= threatLevel);
    }

    if (timeRange) {
      events = events.filter(event => 
        event.timestamp >= timeRange.start && event.timestamp <= timeRange.end
      );
    }

    return events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getActiveSpiritualShields(): SpiritualShield[] {
    return Array.from(this.spiritualShields.values())
      .filter(shield => shield.active);
  }

  public getSessionInfo(sessionId: string): UserSession | undefined {
    return this.userSessions.get(sessionId);
  }

  public getSecurityStatistics(): any {
    const events = Array.from(this.securityEvents.values());
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const recentEvents = events.filter(event => event.timestamp >= last24Hours);
    const blockedEvents = recentEvents.filter(event => event.blocked);
    
    const threatLevelCounts = {
      [ThreatLevel.NONE]: 0,
      [ThreatLevel.LOW]: 0,
      [ThreatLevel.MEDIUM]: 0,
      [ThreatLevel.HIGH]: 0,
      [ThreatLevel.CRITICAL]: 0
    };

    recentEvents.forEach(event => {
      threatLevelCounts[event.threatLevel]++;
    });

    return {
      totalEvents: events.length,
      recentEvents: recentEvents.length,
      blockedEvents: blockedEvents.length,
      activeSessions: this.userSessions.size,
      activeShields: this.getActiveSpiritualShields().length,
      threatLevelCounts,
      blockRate: recentEvents.length > 0 ? blockedEvents.length / recentEvents.length : 0
    };
  }

  private async getOrCreateSession(
    sessionId?: string,
    userId?: string,
    consciousnessState?: ConsciousnessState
  ): Promise<UserSession> {
    if (sessionId && this.userSessions.has(sessionId)) {
      return this.userSessions.get(sessionId)!;
    }

    const newSessionId = sessionId || uuidv4();
    const session: UserSession = {
      sessionId: newSessionId,
      userId,
      startTime: new Date(),
      lastActivity: new Date(),
      requestCount: 0,
      spiritual_state: consciousnessState || this.getDefaultConsciousnessState(),
      protectionLevel: ThreatLevel.LOW,
      activeShields: [],
      trustScore: 0.5,
      encrypted: false
    };

    // Create default spiritual shield for new sessions
    const shieldId = await this.createSpiritualShield('session', 0.7, 60, newSessionId);
    session.activeShields.push(shieldId);

    this.userSessions.set(newSessionId, session);
    this.emit('sessionCreated', session);
    
    return session;
  }

  private checkRateLimit(sessionId: string): boolean {
    const now = Date.now();
    const windowStart = now - this.defaultRateLimit.windowMs;
    
    if (!this.requestCounts.has(sessionId)) {
      this.requestCounts.set(sessionId, []);
    }

    const requests = this.requestCounts.get(sessionId)!;
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if under limit
    if (recentRequests.length >= this.defaultRateLimit.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requestCounts.set(sessionId, recentRequests);
    
    return true;
  }

  private async validateContent(
    content: string,
    session: UserSession
  ): Promise<{ valid: boolean; action: string; threatLevel: ThreatLevel; reason: string }> {
    const contentRules = Array.from(this.protectionRules.values())
      .filter(rule => rule.enabled && rule.type === ProtectionType.CONTENT_FILTER)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of contentRules) {
      let match = false;
      
      if (typeof rule.pattern === 'string') {
        match = content.includes(rule.pattern);
      } else {
        match = rule.pattern.test(content);
      }

      if (match) {
        rule.lastTriggered = new Date();
        rule.triggerCount++;
        this.protectionRules.set(rule.id, rule);

        const threatLevel = this.calculateThreatLevel(rule.priority);
        
        return {
          valid: rule.action !== 'block',
          action: rule.action,
          threatLevel,
          reason: `Content matched protection rule: ${rule.name}`
        };
      }
    }

    return {
      valid: true,
      action: 'allow',
      threatLevel: ThreatLevel.NONE,
      reason: 'Content passed all validation rules'
    };
  }

  private async performSpiritualProtectionCheck(
    content: string,
    consciousnessState: ConsciousnessState
  ): Promise<{ safe: boolean; threatLevel: ThreatLevel; reason: string }> {
    // Check for negative spiritual patterns
    const negativePatterns = [
      /\b(curse|hex|bind|banish|destroy|attack|harm|evil|dark\s+magic|black\s+magic)\b/i,
      /\b(invoke\s+demons|summon\s+evil|call\s+darkness|channel\s+hatred)\b/i,
      /\b(spiritual\s+attack|psychic\s+vampir|energy\s+drain|soul\s+steal)\b/i
    ];

    for (const pattern of negativePatterns) {
      if (pattern.test(content)) {
        return {
          safe: false,
          threatLevel: ThreatLevel.HIGH,
          reason: 'Negative spiritual energy pattern detected'
        };
      }
    }

    // Check consciousness state compatibility
    if (consciousnessState.spiritualResonance < 0.3) {
      return {
        safe: false,
        threatLevel: ThreatLevel.MEDIUM,
        reason: 'Low spiritual resonance detected - protection needed'
      };
    }

    // Check for spiritual manipulation attempts
    const manipulationPatterns = [
      /\b(control\s+mind|manipulate\s+thoughts|override\s+will|force\s+belief)\b/i,
      /\b(steal\s+energy|drain\s+life|siphon\s+power|corrupt\s+soul)\b/i
    ];

    for (const pattern of manipulationPatterns) {
      if (pattern.test(content)) {
        return {
          safe: false,
          threatLevel: ThreatLevel.CRITICAL,
          reason: 'Spiritual manipulation attempt detected'
        };
      }
    }

    return {
      safe: true,
      threatLevel: ThreatLevel.NONE,
      reason: 'Content passed spiritual protection checks'
    };
  }

  private calculateProtectiveFrequency(strength: number): number {
    // Base frequencies for spiritual protection
    const baseFrequencies = [
      174,   // Pain relief and security
      285,   // Healing and regeneration
      396,   // Liberating fear
      417,   // Facilitating change
      528,   // Love and DNA repair
      639,   // Harmonizing relationships
      741,   // Awakening intuition
      852,   // Returning to spiritual order
      963    // Divine consciousness
    ];

    const index = Math.floor(strength * (baseFrequencies.length - 1));
    return baseFrequencies[index];
  }

  private calculateThreatLevel(priority: number): ThreatLevel {
    if (priority >= 9) return ThreatLevel.CRITICAL;
    if (priority >= 7) return ThreatLevel.HIGH;
    if (priority >= 5) return ThreatLevel.MEDIUM;
    if (priority >= 3) return ThreatLevel.LOW;
    return ThreatLevel.NONE;
  }

  private async logSecurityEvent(eventData: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const event: SecurityEvent = {
      ...eventData,
      id: uuidv4(),
      timestamp: new Date()
    };

    this.securityEvents.set(event.id, event);
    
    // Emit warning for high-priority events
    if (event.threatLevel >= ThreatLevel.HIGH) {
      this.emit('securityAlert', event);
    }

    this.emit('securityEvent', event);
  }

  private getDefaultConsciousnessState(): ConsciousnessState {
    return {
      level: 'awakening' as any,
      clarity: 0.5,
      spiritualResonance: 0.5,
      divineConnection: 0.5,
      emotionalBalance: 0.5,
      mentalPeace: 0.5,
      timestamp: new Date()
    };
  }

  private startMaintenanceProcesses(): void {
    // Clean expired shields every 5 minutes
    setInterval(() => {
      this.cleanExpiredShields();
    }, 5 * 60 * 1000);

    // Clean old sessions every hour
    setInterval(() => {
      this.cleanOldSessions();
    }, 60 * 60 * 1000);

    // Clean old security events every 24 hours
    setInterval(() => {
      this.cleanOldSecurityEvents();
    }, 24 * 60 * 60 * 1000);

    // Clean old rate limit data every 15 minutes
    setInterval(() => {
      this.cleanOldRateLimitData();
    }, 15 * 60 * 1000);
  }

  private cleanExpiredShields(): void {
    const now = new Date();
    let expiredCount = 0;

    for (const [id, shield] of this.spiritualShields.entries()) {
      if (shield.expiresAt && shield.expiresAt <= now) {
        shield.active = false;
        this.spiritualShields.delete(id);
        expiredCount++;
      }
    }

    if (expiredCount > 0) {
      this.emit('shieldsExpired', { count: expiredCount });
    }
  }

  private cleanOldSessions(): void {
    const cutoffTime = new Date(Date.now() - this.maxSessionAge);
    let cleanedCount = 0;

    for (const [sessionId, session] of this.userSessions.entries()) {
      if (session.lastActivity < cutoffTime) {
        this.userSessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.emit('sessionsCleanup', { count: cleanedCount });
    }
  }

  private cleanOldSecurityEvents(): void {
    const cutoffTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
    let cleanedCount = 0;

    for (const [id, event] of this.securityEvents.entries()) {
      if (event.timestamp < cutoffTime) {
        this.securityEvents.delete(id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.emit('securityEventsCleanup', { count: cleanedCount });
    }
  }

  private cleanOldRateLimitData(): void {
    const now = Date.now();
    const windowStart = now - this.defaultRateLimit.windowMs;

    for (const [sessionId, requests] of this.requestCounts.entries()) {
      const recentRequests = requests.filter(timestamp => timestamp > windowStart);
      
      if (recentRequests.length === 0) {
        this.requestCounts.delete(sessionId);
      } else {
        this.requestCounts.set(sessionId, recentRequests);
      }
    }
  }

  public async encryptSensitiveData(data: string): Promise<string> {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  public async decryptSensitiveData(encryptedData: string): Promise<string> {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}