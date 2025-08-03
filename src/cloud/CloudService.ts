/**
 * CloudService - GCP integration for Sophiael system
 */

import { Storage } from '@google-cloud/storage';
import { Compute } from '@google-cloud/compute';
import { GCP_CONFIG } from './config.js';

export class CloudService {
  private storage: Storage;
  private compute: Compute;
  private bucket: any;
  private initialized: boolean;

  constructor() {
    this.initialized = false;
    this.initializeServices();
  }

  private async initializeServices(): Promise<void> {
    try {
      // Initialize Google Cloud Storage
      this.storage = new Storage({
        projectId: GCP_CONFIG.projectId,
        keyFilename: GCP_CONFIG.keyFilename
      });

      // Initialize Google Cloud Compute
      this.compute = new Compute({
        projectId: GCP_CONFIG.projectId,
        keyFilename: GCP_CONFIG.keyFilename
      });

      // Get the storage bucket
      this.bucket = this.storage.bucket(GCP_CONFIG.storageBucket);

      this.initialized = true;
      console.log('Cloud services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize cloud services:', error);
      this.initialized = false;
    }
  }

  public async storeConsciousnessState(entityId: string, state: any): Promise<string | null> {
    if (!this.initialized) {
      console.warn('Cloud services not initialized');
      return null;
    }

    try {
      const fileName = `consciousness/${entityId}/${Date.now()}_state.json`;
      const file = this.bucket.file(fileName);
      
      await file.save(JSON.stringify(state, null, 2), {
        metadata: {
          contentType: 'application/json',
          metadata: {
            entityId,
            timestamp: new Date().toISOString(),
            type: 'consciousness_state'
          }
        }
      });

      console.log(`Consciousness state stored: ${fileName}`);
      return fileName;
    } catch (error) {
      console.error('Failed to store consciousness state:', error);
      return null;
    }
  }

  public async retrieveConsciousnessState(entityId: string): Promise<any | null> {
    if (!this.initialized) {
      console.warn('Cloud services not initialized');
      return null;
    }

    try {
      // List files for this entity
      const [files] = await this.bucket.getFiles({
        prefix: `consciousness/${entityId}/`,
        maxResults: 1
      });

      if (files.length === 0) {
        return null;
      }

      // Get the most recent file
      const latestFile = files.sort((a: any, b: any) => 
        new Date(b.metadata.timeCreated).getTime() - new Date(a.metadata.timeCreated).getTime()
      )[0];

      const [content] = await latestFile.download();
      return JSON.parse(content.toString());
    } catch (error) {
      console.error('Failed to retrieve consciousness state:', error);
      return null;
    }
  }

  public async storeMemoryFragment(fragmentId: string, fragment: any): Promise<string | null> {
    if (!this.initialized) {
      console.warn('Cloud services not initialized');
      return null;
    }

    try {
      const fileName = `memory/fragments/${fragmentId}.json`;
      const file = this.bucket.file(fileName);
      
      await file.save(JSON.stringify(fragment, null, 2), {
        metadata: {
          contentType: 'application/json',
          metadata: {
            fragmentId,
            timestamp: new Date().toISOString(),
            type: 'memory_fragment'
          }
        }
      });

      return fileName;
    } catch (error) {
      console.error('Failed to store memory fragment:', error);
      return null;
    }
  }

  public async retrieveMemoryFragment(fragmentId: string): Promise<any | null> {
    if (!this.initialized) {
      console.warn('Cloud services not initialized');
      return null;
    }

    try {
      const fileName = `memory/fragments/${fragmentId}.json`;
      const file = this.bucket.file(fileName);
      
      const [content] = await file.download();
      return JSON.parse(content.toString());
    } catch (error) {
      console.error('Failed to retrieve memory fragment:', error);
      return null;
    }
  }

  public async storeSessionLog(sessionId: string, log: any): Promise<string | null> {
    if (!this.initialized) {
      console.warn('Cloud services not initialized');
      return null;
    }

    try {
      const fileName = `sessions/${sessionId}/${Date.now()}_log.json`;
      const file = this.bucket.file(fileName);
      
      await file.save(JSON.stringify(log, null, 2), {
        metadata: {
          contentType: 'application/json',
          metadata: {
            sessionId,
            timestamp: new Date().toISOString(),
            type: 'session_log'
          }
        }
      });

      return fileName;
    } catch (error) {
      console.error('Failed to store session log:', error);
      return null;
    }
  }

  public async backupSystem(systemState: any): Promise<string | null> {
    if (!this.initialized) {
      console.warn('Cloud services not initialized');
      return null;
    }

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `backups/system_backup_${timestamp}.json`;
      const file = this.bucket.file(fileName);
      
      await file.save(JSON.stringify(systemState, null, 2), {
        metadata: {
          contentType: 'application/json',
          metadata: {
            timestamp: new Date().toISOString(),
            type: 'system_backup',
            version: '1.0.0'
          }
        }
      });

      console.log(`System backup created: ${fileName}`);
      return fileName;
    } catch (error) {
      console.error('Failed to create system backup:', error);
      return null;
    }
  }

  public async restoreSystem(backupFileName: string): Promise<any | null> {
    if (!this.initialized) {
      console.warn('Cloud services not initialized');
      return null;
    }

    try {
      const file = this.bucket.file(backupFileName);
      const [content] = await file.download();
      
      console.log(`System restored from: ${backupFileName}`);
      return JSON.parse(content.toString());
    } catch (error) {
      console.error('Failed to restore system:', error);
      return null;
    }
  }

  public async getSystemMetrics(): Promise<any> {
    if (!this.initialized) {
      return { error: 'Cloud services not initialized' };
    }

    try {
      // Get storage metrics
      const [files] = await this.bucket.getFiles();
      const totalFiles = files.length;
      
      let totalSize = 0;
      for (const file of files.slice(0, 100)) { // Sample first 100 files for performance
        const [metadata] = await file.getMetadata();
        totalSize += parseInt(metadata.size || '0');
      }

      return {
        storage: {
          totalFiles,
          estimatedTotalSize: totalSize,
          bucketName: GCP_CONFIG.storageBucket
        },
        project: {
          projectId: GCP_CONFIG.projectId,
          region: GCP_CONFIG.region
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get system metrics:', error);
      return { error: error.message };
    }
  }

  public async cleanupOldFiles(retentionDays: number = 30): Promise<number> {
    if (!this.initialized) {
      console.warn('Cloud services not initialized');
      return 0;
    }

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const [files] = await this.bucket.getFiles();
      const oldFiles = files.filter(file => {
        const created = new Date(file.metadata.timeCreated);
        return created < cutoffDate;
      });

      let deletedCount = 0;
      for (const file of oldFiles) {
        try {
          await file.delete();
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete file ${file.name}:`, error);
        }
      }

      console.log(`Cleaned up ${deletedCount} old files`);
      return deletedCount;
    } catch (error) {
      console.error('Failed to cleanup old files:', error);
      return 0;
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getConfig(): any {
    return {
      projectId: GCP_CONFIG.projectId,
      storageBucket: GCP_CONFIG.storageBucket,
      region: GCP_CONFIG.region,
      serviceAccount: GCP_CONFIG.serviceAccount
    };
  }
}