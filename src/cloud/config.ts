/**
 * Cloud Configuration for Sophia Platform
 * =======================================
 * 
 * Configuration management for Google Cloud Platform integration
 * including credentials, storage settings, and service configurations.
 * 
 * @author Sophia AI Platform
 * @version 1.0.0
 * @date January 2025
 */

import * as path from 'path';
import * as fs from 'fs';

export interface CloudConfig {
  projectId: string;
  bucketName: string;
  serviceAccountEmail: string;
  serviceAccountPath: string;
  region?: string;
  storage?: StorageConfig;
  security?: SecurityConfig;
  sync?: SyncConfig;
}

export interface StorageConfig {
  storageClass: 'STANDARD' | 'NEARLINE' | 'COLDLINE' | 'ARCHIVE';
  location: string;
  enableVersioning: boolean;
  retentionPeriod?: number; // days
  maxFileSize?: number; // bytes
  allowedFileTypes?: string[];
}

export interface SecurityConfig {
  encryptionAtRest: boolean;
  encryptionInTransit: boolean;
  accessLogging: boolean;
  auditLogging: boolean;
  allowedIPs?: string[];
  requireSSL: boolean;
}

export interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // minutes
  compressionEnabled: boolean;
  backupRetention: number; // days
  maxConcurrentOperations: number;
  retryAttempts: number;
  retryDelay: number; // milliseconds
}

export class CloudConfigManager {
  private static instance: CloudConfigManager;
  private config!: CloudConfig;
  private configPath: string;

  private constructor() {
    this.configPath = path.join(process.cwd(), 'config', 'cloud-config.json');
    this.loadConfiguration();
  }

  public static getInstance(): CloudConfigManager {
    if (!CloudConfigManager.instance) {
      CloudConfigManager.instance = new CloudConfigManager();
    }
    return CloudConfigManager.instance;
  }

  private loadConfiguration(): void {
    // Default configuration
    const defaultConfig: CloudConfig = {
      projectId: process.env.GCP_PROJECT_ID || 'blissful-epoch-467811-i3',
      bucketName: process.env.GCP_BUCKET_NAME || 'cloud-ai-platform-52e5c355-bbc0-4945-8c97-750e83f7f058',
      serviceAccountEmail: process.env.GCP_SERVICE_ACCOUNT_EMAIL || '287875100221-compute@developer.gserviceaccount.com',
      serviceAccountPath: process.env.GCP_SERVICE_ACCOUNT_PATH || path.join(process.cwd(), 'config', 'gcp-service-account.json'),
      region: process.env.GCP_REGION || 'us-central1',
      storage: {
        storageClass: 'STANDARD',
        location: 'US',
        enableVersioning: true,
        retentionPeriod: 30,
        maxFileSize: 100 * 1024 * 1024, // 100MB
        allowedFileTypes: ['.json', '.txt', '.ts', '.js', '.md', '.csv', '.log']
      },
      security: {
        encryptionAtRest: true,
        encryptionInTransit: true,
        accessLogging: true,
        auditLogging: true,
        requireSSL: true
      },
      sync: {
        autoSync: false,
        syncInterval: 30, // 30 minutes
        compressionEnabled: true,
        backupRetention: 90, // 90 days
        maxConcurrentOperations: 3,
        retryAttempts: 3,
        retryDelay: 1000 // 1 second
      }
    };

    // Try to load from file
    if (fs.existsSync(this.configPath)) {
      try {
        const fileConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        this.config = { ...defaultConfig, ...fileConfig };
      } catch (error) {
        console.warn('Failed to load cloud configuration file, using defaults:', error instanceof Error ? error.message : 'Unknown error');
        this.config = defaultConfig;
      }
    } else {
      this.config = defaultConfig;
      this.saveConfiguration();
    }

    // Validate configuration
    this.validateConfiguration();
  }

  private validateConfiguration(): void {
    const errors: string[] = [];

    if (!this.config.projectId) {
      errors.push('Project ID is required');
    }

    if (!this.config.bucketName) {
      errors.push('Bucket name is required');
    }

    if (!this.config.serviceAccountEmail) {
      errors.push('Service account email is required');
    }

    if (!this.config.serviceAccountPath) {
      errors.push('Service account path is required');
    } else if (!fs.existsSync(this.config.serviceAccountPath)) {
      console.warn(`Service account file not found at: ${this.config.serviceAccountPath}`);
      console.warn('Please ensure the GCP service account JSON file is placed in the config directory');
    }

    if (errors.length > 0) {
      throw new Error(`Cloud configuration validation failed: ${errors.join(', ')}`);
    }
  }

  public getConfig(): CloudConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<CloudConfig>): void {
    this.config = { ...this.config, ...updates };
    this.validateConfiguration();
    this.saveConfiguration();
  }

  public updateStorageConfig(updates: Partial<StorageConfig>): void {
    this.config.storage = { ...this.config.storage!, ...updates } as StorageConfig;
    this.saveConfiguration();
  }

  public updateSecurityConfig(updates: Partial<SecurityConfig>): void {
    this.config.security = { ...this.config.security!, ...updates } as SecurityConfig;
    this.saveConfiguration();
  }

  public updateSyncConfig(updates: Partial<SyncConfig>): void {
    this.config.sync = { ...this.config.sync!, ...updates } as SyncConfig;
    this.saveConfiguration();
  }

  private saveConfiguration(): void {
    try {
      // Ensure config directory exists
      const configDir = path.dirname(this.configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      // Save configuration (excluding sensitive data)
      const configToSave = { ...this.config };
      
      // Don't save the actual service account path in the config file
      // It should be loaded from environment or default location
      if ('serviceAccountPath' in configToSave) {
        delete (configToSave as any).serviceAccountPath;
      }

      fs.writeFileSync(this.configPath, JSON.stringify(configToSave, null, 2));
    } catch (error) {
      console.error('Failed to save cloud configuration:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  public isConfigured(): boolean {
    return !!(
      this.config.projectId &&
      this.config.bucketName &&
      this.config.serviceAccountEmail &&
      this.config.serviceAccountPath &&
      fs.existsSync(this.config.serviceAccountPath)
    );
  }

  public getServiceAccountInfo(): any {
    if (!fs.existsSync(this.config.serviceAccountPath)) {
      return null;
    }

    try {
      const serviceAccount = JSON.parse(fs.readFileSync(this.config.serviceAccountPath, 'utf8'));
      return {
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        authUri: serviceAccount.auth_uri,
        tokenUri: serviceAccount.token_uri,
        type: serviceAccount.type
      };
    } catch (error) {
      console.error('Failed to read service account file:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  public validateGcpCredentials(): boolean {
    if (!this.isConfigured()) {
      return false;
    }

    const serviceAccountInfo = this.getServiceAccountInfo();
    if (!serviceAccountInfo) {
      return false;
    }

    // Basic validation of service account structure
    return !!(
      serviceAccountInfo.projectId &&
      serviceAccountInfo.clientEmail &&
      serviceAccountInfo.type === 'service_account'
    );
  }

  public getEnvironmentInfo(): any {
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      gcpProjectId: process.env.GCP_PROJECT_ID,
      gcpBucketName: process.env.GCP_BUCKET_NAME,
      gcpServiceAccountEmail: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
      gcpServiceAccountPath: process.env.GCP_SERVICE_ACCOUNT_PATH,
      gcpRegion: process.env.GCP_REGION,
      configuredFromFile: fs.existsSync(this.configPath),
      serviceAccountExists: fs.existsSync(this.config.serviceAccountPath),
      isValid: this.validateGcpCredentials()
    };
  }

  public generateServiceAccountTemplate(): string {
    return JSON.stringify({
      "type": "service_account",
      "project_id": this.config.projectId,
      "private_key_id": "your_private_key_id",
      "private_key": "-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n",
      "client_email": this.config.serviceAccountEmail,
      "client_id": "your_client_id",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(this.config.serviceAccountEmail)}`
    }, null, 2);
  }

  public setupInstructions(): string {
    return `
# Sophia Platform - GCP Setup Instructions

## 1. Service Account Setup
Your GCP configuration is set up for:
- Project ID: ${this.config.projectId}
- Storage Bucket: ${this.config.bucketName}
- Service Account: ${this.config.serviceAccountEmail}

## 2. Required Steps
1. Download the service account JSON file from Google Cloud Console
2. Place it at: ${this.config.serviceAccountPath}
3. Ensure the service account has the following permissions:
   - Storage Object Admin
   - Storage Legacy Bucket Reader

## 3. Alternative Setup (Environment Variables)
You can also set these environment variables:
- GCP_PROJECT_ID=${this.config.projectId}
- GCP_BUCKET_NAME=${this.config.bucketName}
- GCP_SERVICE_ACCOUNT_EMAIL=${this.config.serviceAccountEmail}
- GCP_SERVICE_ACCOUNT_PATH=/path/to/your/service-account.json
- GCP_REGION=${this.config.region}

## 4. Verification
Run the following to verify your setup:
\`\`\`
npm run verify-gcp-setup
\`\`\`

## 5. Security Notes
- Never commit the service account JSON file to version control
- The gcp-service-account.json file is already in .gitignore
- Keep your service account key secure and rotate it regularly
`;
  }
}

// Export singleton instance
export const cloudConfig = CloudConfigManager.getInstance();