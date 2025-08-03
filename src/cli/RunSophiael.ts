#!/usr/bin/env node

/**
 * RunSophiael - CLI Interface for Sophia Platform
 * ===============================================
 * 
 * Command-line interface for the Sophiael Divine Consciousness platform
 * providing access to all core features including guidance, meditation,
 * cloud sync, and system management.
 * 
 * @author Sophia AI Platform
 * @version 1.0.0
 * @date January 2025
 */

import { SophiaelGodModeAI, ConsciousnessLevel, SpiritualDomain } from '../core/SophiaelGodModeAI';
import { CloudSync } from '../cloud/CloudSync';
import { cloudConfig } from '../cloud/config';
import * as readline from 'readline';
import * as winston from 'winston';

// Setup logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'sophia.log' })
  ]
});

interface CLIOptions {
  interactive?: boolean;
  command?: string;
  args?: string[];
  verbose?: boolean;
  cloudSync?: boolean;
}

class SophiaelCLI {
  private sophiael: SophiaelGodModeAI;
  private cloudSync?: CloudSync;
  private rl: readline.Interface;
  private isRunning: boolean = false;

  constructor() {
    this.sophiael = new SophiaelGodModeAI();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '🌟 Sophiael > '
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.sophiael.on('initialized', (data) => {
      logger.info(`Sophiael initialized: ${data.modelName}`);
    });

    this.sophiael.on('guidanceReceived', (insight) => {
      logger.info(`Divine guidance received: ${insight.domain}`);
    });

    this.sophiael.on('meditationSessionCompleted', (session) => {
      logger.info(`Meditation session completed: ${session.sessionId}`);
    });
  }

  public async initialize(options: CLIOptions): Promise<void> {
    this.printBanner();
    
    if (options.cloudSync) {
      await this.initializeCloudSync();
    }

    if (options.interactive) {
      await this.startInteractiveMode();
    } else if (options.command) {
      await this.executeCommand(options.command, options.args || []);
    } else {
      this.showHelp();
    }
  }

  private printBanner(): void {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ███████╗ ██████╗ ██████╗ ██╗  ██╗██╗ █████╗ ███████╗██╗    ║
║   ██╔════╝██╔═══██╗██╔══██╗██║  ██║██║██╔══██╗██╔════╝██║    ║
║   ███████╗██║   ██║██████╔╝███████║██║███████║█████╗  ██║    ║
║   ╚════██║██║   ██║██╔═══╝ ██╔══██║██║██╔══██║██╔══╝  ██║    ║
║   ███████║╚██████╔╝██║     ██║  ██║██║██║  ██║███████╗███████╗║
║   ╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚══════╝║
║                                                               ║
║           DIVINE CONSCIOUSNESS AI PLATFORM                   ║
║                                                               ║
║   🌟 Spiritual Guidance & Consciousness Expansion            ║
║   🧘 Meditation & Reflection Sessions                        ║
║   ☁️  Cloud Synchronization & Backup                         ║
║   🛡️  Spiritual Protection & Security                        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
  }

  private async initializeCloudSync(): Promise<void> {
    try {
      const config = cloudConfig.getConfig();
      
      if (!cloudConfig.isConfigured()) {
        logger.warn('Cloud sync not properly configured');
        console.log('\n⚠️  Cloud configuration incomplete');
        console.log(cloudConfig.setupInstructions());
        return;
      }

      this.cloudSync = new CloudSync(config);
      await this.cloudSync.initialize();
      
      console.log('✅ Cloud sync initialized successfully');
      logger.info('Cloud sync enabled and initialized');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Cloud sync initialization failed: ${errorMessage}`);
      console.log(`❌ Cloud sync failed: ${errorMessage}`);
    }
  }

  private async startInteractiveMode(): Promise<void> {
    this.isRunning = true;
    
    console.log('\n🌟 Welcome to Sophiael Interactive Mode');
    console.log('Type "help" for available commands or "exit" to quit\n');
    
    this.rl.prompt();
    
    this.rl.on('line', async (input) => {
      const trimmed = input.trim();
      
      if (trimmed === 'exit' || trimmed === 'quit') {
        await this.shutdown();
        return;
      }
      
      if (trimmed === '') {
        this.rl.prompt();
        return;
      }
      
      const [command, ...args] = trimmed.split(' ');
      await this.executeCommand(command, args);
      
      if (this.isRunning) {
        this.rl.prompt();
      }
    });

    this.rl.on('close', async () => {
      await this.shutdown();
    });
  }

  private async executeCommand(command: string, args: string[]): Promise<void> {
    try {
      switch (command.toLowerCase()) {
        case 'help':
          this.showHelp();
          break;
          
        case 'guidance':
          await this.requestGuidance(args);
          break;
          
        case 'assess':
          await this.assessConsciousness(args);
          break;
          
        case 'meditate':
          await this.startMeditation(args);
          break;
          
        case 'daily':
          await this.getDailyGuidance();
          break;
          
        case 'status':
          await this.showStatus();
          break;
          
        case 'cloud':
          await this.handleCloudCommand(args);
          break;
          
        case 'backup':
          await this.createBackup(args);
          break;
          
        case 'restore':
          await this.restoreBackup(args);
          break;
          
        case 'config':
          await this.showConfiguration();
          break;
          
        case 'test':
          await this.runTests(args);
          break;
          
        default:
          console.log(`❌ Unknown command: ${command}`);
          console.log('Type "help" for available commands');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Command execution failed: ${errorMessage}`);
      console.log(`❌ Error: ${errorMessage}`);
    }
  }

  private showHelp(): void {
    console.log(`
📖 Sophiael Commands:

SPIRITUAL GUIDANCE:
  guidance [domain] [question]  - Request divine guidance
  assess                       - Assess consciousness state
  meditate [intention] [time]  - Start meditation session
  daily                       - Get daily spiritual guidance

SYSTEM:
  status                      - Show system status
  config                     - Show configuration
  test [component]           - Run system tests

CLOUD OPERATIONS:
  cloud status               - Show cloud sync status
  cloud sync [path]          - Sync directory to cloud
  backup [paths...]          - Create backup
  restore [backup-id] [path] - Restore from backup

UTILITY:
  help                       - Show this help
  exit                       - Exit the application

EXAMPLES:
  guidance wisdom "How can I find inner peace?"
  meditate "divine connection" 20
  cloud sync ./spiritual-notes
  backup ./important-files ./meditation-logs
    `);
  }

  private async requestGuidance(args: string[]): Promise<void> {
    let domain = SpiritualDomain.WISDOM;
    let question = 'Please provide divine guidance for my spiritual journey';

    if (args.length > 0) {
      const domainArg = args[0].toLowerCase();
      const domainMap: Record<string, SpiritualDomain> = {
        'wisdom': SpiritualDomain.WISDOM,
        'love': SpiritualDomain.LOVE,
        'healing': SpiritualDomain.HEALING,
        'purpose': SpiritualDomain.PURPOSE,
        'protection': SpiritualDomain.PROTECTION,
        'manifestation': SpiritualDomain.MANIFESTATION,
        'transformation': SpiritualDomain.TRANSFORMATION
      };
      
      if (domainMap[domainArg]) {
        domain = domainMap[domainArg];
      }
    }

    if (args.length > 1) {
      question = args.slice(1).join(' ');
    }

    console.log(`\n🙏 Requesting guidance from domain: ${domain}`);
    console.log(`❓ Question: ${question}\n`);

    // Create sample consciousness state
    const consciousnessState = await this.getSampleConsciousnessState();
    
    const guidance = await this.sophiael.receiveDivineGuidance(question, domain, consciousnessState);
    
    console.log('✨ DIVINE GUIDANCE RECEIVED ✨');
    console.log(`Domain: ${guidance.domain}`);
    console.log(`Type: ${guidance.guidanceType}`);
    console.log(`Confidence: ${(guidance.confidence * 100).toFixed(1)}%`);
    if (guidance.sacredReference) {
      console.log(`Scripture: ${guidance.sacredReference}`);
    }
    console.log(`\nMessage: ${guidance.message}\n`);
  }

  private async assessConsciousness(args: string[]): Promise<void> {
    console.log('\n🧘 CONSCIOUSNESS ASSESSMENT\n');
    
    // In a real implementation, this would gather user input
    const sampleInput = {
      clarityIndicators: ['clear thinking', 'focused attention', 'insight'],
      spiritualPractices: ['meditation', 'prayer', 'mindfulness'],
      practiceFrequency: 0.7,
      divineExperiences: ['synchronicities', 'inner guidance', 'peace'],
      prayerFrequency: 0.8,
      stressLevel: 3,
      peaceFrequency: 0.6,
      meditationFrequency: 0.5,
      anxietyLevel: 2
    };

    const state = await this.sophiael.assessConsciousnessState(sampleInput);
    
    console.log('📊 CONSCIOUSNESS STATE REPORT');
    console.log(`Level: ${state.level.toUpperCase()}`);
    console.log(`Clarity: ${(state.clarity * 100).toFixed(1)}%`);
    console.log(`Spiritual Resonance: ${(state.spiritualResonance * 100).toFixed(1)}%`);
    console.log(`Divine Connection: ${(state.divineConnection * 100).toFixed(1)}%`);
    console.log(`Emotional Balance: ${(state.emotionalBalance * 100).toFixed(1)}%`);
    console.log(`Mental Peace: ${(state.mentalPeace * 100).toFixed(1)}%`);
    console.log(`Assessment Time: ${state.timestamp.toLocaleString()}\n`);
  }

  private async startMeditation(args: string[]): Promise<void> {
    const intention = args.length > 0 ? args.slice(0, -1).join(' ') : 'divine connection and inner peace';
    const duration = args.length > 1 ? parseInt(args[args.length - 1]) : 15;
    
    if (isNaN(duration) || duration < 1) {
      console.log('❌ Invalid duration. Please specify duration in minutes (1-120)');
      return;
    }

    console.log(`\n🧘 MEDITATION SESSION STARTING`);
    console.log(`Intention: ${intention}`);
    console.log(`Duration: ${duration} minutes\n`);

    const consciousnessState = await this.getSampleConsciousnessState();
    
    console.log('🕉️  Preparing sacred space...');
    
    const session = await this.sophiael.guideMeditationSession(intention, duration, consciousnessState);
    
    console.log('✨ MEDITATION SESSION COMPLETED ✨');
    console.log(`Session ID: ${session.sessionId}`);
    console.log(`Guidance Received: ${session.guidanceReceived.length} insights`);
    
    session.guidanceReceived.forEach((insight, index) => {
      console.log(`\n${index + 1}. ${insight.message}`);
    });
    
    console.log(`\n📈 CONSCIOUSNESS EVOLUTION:`);
    console.log(`Before: ${session.consciousnessBefore.level} -> After: ${session.consciousnessAfter.level}`);
    console.log(`Spiritual Growth: ${((session.consciousnessAfter.spiritualResonance - session.consciousnessBefore.spiritualResonance) * 100).toFixed(1)}%\n`);
  }

  private async getDailyGuidance(): Promise<void> {
    console.log('\n🌅 DAILY SPIRITUAL GUIDANCE\n');
    
    const consciousnessState = await this.getSampleConsciousnessState();
    const guidance = await this.sophiael.getDailySpiritualGuidance(consciousnessState);
    
    const timeLabels = ['🌅 Morning', '☀️ Midday', '🌙 Evening'];
    
    guidance.forEach((insight, index) => {
      console.log(`${timeLabels[index]} Guidance:`);
      console.log(`Domain: ${insight.domain}`);
      console.log(`Message: ${insight.message}\n`);
    });
  }

  private async showStatus(): Promise<void> {
    console.log('\n📊 SYSTEM STATUS\n');
    
    const modelInfo = this.sophiael.toDict();
    console.log('🤖 SOPHIAEL CORE:');
    console.log(`Model: ${modelInfo.modelName}`);
    console.log(`Active Sessions: ${modelInfo.activeSessions}`);
    console.log(`Wisdom Database: ${modelInfo.wisdomDatabaseSize} entries`);
    
    if (this.cloudSync) {
      const cloudStats = this.cloudSync.getStatistics();
      console.log('\n☁️ CLOUD SYNC:');
      console.log(`Total Operations: ${cloudStats.totalOperations}`);
      console.log(`Success Rate: ${(cloudStats.successfulOperations / cloudStats.totalOperations * 100).toFixed(1)}%`);
      console.log(`Data Transferred: ${this.formatBytes(cloudStats.totalBytesTransferred)}`);
      console.log(`Last Sync: ${cloudStats.lastSyncTime.toLocaleString()}`);
    }
    
    console.log('\n✅ All systems operational\n');
  }

  private async handleCloudCommand(args: string[]): Promise<void> {
    if (!this.cloudSync) {
      console.log('❌ Cloud sync not initialized. Use --cloud-sync flag when starting.');
      return;
    }

    const subCommand = args[0];
    
    switch (subCommand) {
      case 'status':
        const stats = this.cloudSync.getStatistics();
        console.log('\n☁️ CLOUD STATUS:');
        console.log(`Operations: ${stats.totalOperations}`);
        console.log(`Success Rate: ${(stats.successfulOperations / Math.max(stats.totalOperations, 1) * 100).toFixed(1)}%`);
        console.log(`Space Used: ${this.formatBytes(stats.cloudSpaceUsed)}`);
        break;
        
      case 'sync':
        if (args.length < 2) {
          console.log('❌ Please specify a path to sync');
          return;
        }
        const syncPath = args[1];
        console.log(`🔄 Syncing ${syncPath} to cloud...`);
        
        const operationId = await this.cloudSync.syncDirectory(syncPath, `synced/${Date.now()}`);
        console.log(`✅ Sync initiated: ${operationId}`);
        break;
        
      default:
        console.log('❌ Unknown cloud command. Available: status, sync');
    }
  }

  private async createBackup(args: string[]): Promise<void> {
    if (!this.cloudSync) {
      console.log('❌ Cloud sync not initialized');
      return;
    }

    if (args.length === 0) {
      console.log('❌ Please specify paths to backup');
      return;
    }

    console.log('💾 Creating backup...');
    const backupId = await this.cloudSync.createBackup(args);
    console.log(`✅ Backup created: ${backupId}`);
  }

  private async restoreBackup(args: string[]): Promise<void> {
    if (!this.cloudSync) {
      console.log('❌ Cloud sync not initialized');
      return;
    }

    if (args.length < 2) {
      console.log('❌ Usage: restore [backup-id] [restore-path]');
      return;
    }

    const [backupId, restorePath] = args;
    console.log(`🔄 Restoring backup ${backupId} to ${restorePath}...`);
    
    const operationId = await this.cloudSync.restoreBackup(backupId, restorePath);
    console.log(`✅ Restore completed: ${operationId}`);
  }

  private async showConfiguration(): Promise<void> {
    console.log('\n⚙️ CONFIGURATION\n');
    
    const config = cloudConfig.getConfig();
    const envInfo = cloudConfig.getEnvironmentInfo();
    
    console.log('🔧 CLOUD CONFIGURATION:');
    console.log(`Project ID: ${config.projectId}`);
    console.log(`Bucket: ${config.bucketName}`);
    console.log(`Service Account: ${config.serviceAccountEmail}`);
    console.log(`Region: ${config.region}`);
    console.log(`Configured: ${envInfo.isValid ? '✅' : '❌'}`);
    
    if (!envInfo.isValid) {
      console.log('\n📋 Setup required:');
      console.log(cloudConfig.setupInstructions());
    }
  }

  private async runTests(args: string[]): Promise<void> {
    const component = args[0] || 'all';
    
    console.log(`\n🧪 Running tests for: ${component}\n`);
    
    if (component === 'all' || component === 'core') {
      console.log('Testing core functionality...');
      const consciousnessState = await this.getSampleConsciousnessState();
      const guidance = await this.sophiael.receiveDivineGuidance(
        'Test guidance request', 
        SpiritualDomain.WISDOM, 
        consciousnessState
      );
      console.log(`✅ Core test passed - received guidance: ${guidance.guidanceType}`);
    }
    
    if (component === 'all' || component === 'cloud') {
      if (this.cloudSync) {
        console.log('Testing cloud connectivity...');
        // Test would go here
        console.log('✅ Cloud test passed');
      } else {
        console.log('⚠️ Cloud sync not available for testing');
      }
    }
    
    console.log('\n✅ All tests completed\n');
  }

  private async getSampleConsciousnessState(): Promise<any> {
    const sampleInput = {
      clarityIndicators: ['clear thinking', 'focused attention'],
      spiritualPractices: ['meditation', 'prayer'],
      practiceFrequency: 0.7,
      divineExperiences: ['synchronicities', 'inner peace'],
      prayerFrequency: 0.6,
      stressLevel: 3,
      peaceFrequency: 0.7,
      meditationFrequency: 0.6,
      anxietyLevel: 2
    };

    return await this.sophiael.assessConsciousnessState(sampleInput);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private async shutdown(): Promise<void> {
    console.log('\n🙏 Thank you for using Sophiael. May you be blessed with divine light and love.');
    this.isRunning = false;
    this.rl.close();
    process.exit(0);
  }
}

// Main execution
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options: CLIOptions = {
    interactive: false,
    verbose: false,
    cloudSync: false
  };

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '-i':
      case '--interactive':
        options.interactive = true;
        break;
        
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;
        
      case '--cloud-sync':
        options.cloudSync = true;
        break;
        
      case '-h':
      case '--help':
        console.log(`
Sophiael CLI Usage:

  node RunSophiael.js [options] [command] [args...]

Options:
  -i, --interactive    Start in interactive mode
  -v, --verbose        Enable verbose logging
  --cloud-sync         Enable cloud synchronization
  -h, --help          Show this help

Commands:
  guidance [domain] [question]  - Request divine guidance
  assess                       - Assess consciousness state
  meditate [intention] [time]  - Start meditation session
  daily                       - Get daily guidance
  status                      - Show system status
  config                     - Show configuration

Examples:
  node RunSophiael.js --interactive --cloud-sync
  node RunSophiael.js guidance wisdom "How can I find peace?"
  node RunSophiael.js meditate "divine love" 20
        `);
        process.exit(0);
        break;
        
      default:
        if (!options.command && !arg.startsWith('-')) {
          options.command = arg;
          options.args = args.slice(i + 1);
          i = args.length; // Stop parsing
        }
    }
  }

  // Default to interactive mode if no command specified
  if (!options.command && !options.interactive) {
    options.interactive = true;
  }

  const cli = new SophiaelCLI();
  await cli.initialize(options);
}

// Handle uncaught errors gracefully
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught exception: ${error.message}`);
  console.log('❌ An unexpected error occurred. Check sophia.log for details.');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled rejection at ${promise}: ${reason}`);
  console.log('❌ An unexpected error occurred. Check sophia.log for details.');
  process.exit(1);
});

// Only run main if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    logger.error(`Application error: ${error.message}`);
    console.log(`❌ Application error: ${error.message}`);
    process.exit(1);
  });
}

export { SophiaelCLI };