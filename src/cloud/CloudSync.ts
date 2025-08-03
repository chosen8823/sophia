/**
 * CloudSync - GCP Integration for Sophia Platform
 * ===============================================
 * 
 * Provides comprehensive Google Cloud Platform integration for the
 * Sophiael Divine Consciousness system including cloud storage,
 * backup, synchronization, and distributed processing capabilities.
 * 
 * @author Sophia AI Platform
 * @version 1.0.0
 * @date January 2025
 */

import { Storage } from '@google-cloud/storage';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { CloudConfig } from './config';

export interface SyncOperation {
  id: string;
  type: SyncOperationType;
  status: SyncStatus;
  startTime: Date;
  endTime?: Date;
  progress: number; // 0.0 to 1.0
  details: any;
  error?: string;
}

export enum SyncOperationType {
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  BACKUP = 'backup',
  RESTORE = 'restore',
  SYNC = 'sync',
  DELETE = 'delete'
}

export enum SyncStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface CloudFile {
  name: string;
  path: string;
  size: number;
  lastModified: Date;
  contentType: string;
  metadata: Record<string, any>;
  localPath?: string;
}

export interface BackupManifest {
  id: string;
  timestamp: Date;
  version: string;
  files: CloudFile[];
  totalSize: number;
  checksum: string;
  compressed: boolean;
}

export interface SyncStatistics {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  totalBytesTransferred: number;
  averageTransferSpeed: number; // bytes per second
  lastSyncTime: Date;
  cloudSpaceUsed: number;
  cloudSpaceAvailable: number;
}

export class CloudSync extends EventEmitter {
  private storage!: Storage;
  private bucket: any;
  private config: CloudConfig;
  private operations: Map<string, SyncOperation>;
  private syncStatistics: SyncStatistics;
  private isInitialized: boolean = false;

  constructor(config: CloudConfig) {
    super();
    this.config = config;
    this.operations = new Map();
    this.syncStatistics = {
      totalOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      totalBytesTransferred: 0,
      averageTransferSpeed: 0,
      lastSyncTime: new Date(),
      cloudSpaceUsed: 0,
      cloudSpaceAvailable: 0
    };
  }

  public async initialize(): Promise<void> {
    try {
      // Initialize Google Cloud Storage
      this.storage = new Storage({
        projectId: this.config.projectId,
        keyFilename: this.config.serviceAccountPath
      });

      // Get or create bucket
      this.bucket = this.storage.bucket(this.config.bucketName);
      
      // Verify bucket exists and is accessible
      const [exists] = await this.bucket.exists();
      if (!exists) {
        await this.bucket.create({
          location: this.config.region || 'US',
          storageClass: 'STANDARD'
        });
        console.log(`Created bucket: ${this.config.bucketName}`);
      }

      // Update storage statistics
      await this.updateStorageStatistics();

      this.isInitialized = true;
      this.emit('initialized', { 
        projectId: this.config.projectId,
        bucket: this.config.bucketName 
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.emit('error', { 
        type: 'initialization_failed', 
        error: errorMessage 
      });
      throw new Error(`Failed to initialize CloudSync: ${errorMessage}`);
    }
  }

  public async uploadFile(
    localPath: string, 
    cloudPath: string, 
    metadata?: Record<string, any>
  ): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('CloudSync not initialized');
    }

    const operationId = uuidv4();
    const operation: SyncOperation = {
      id: operationId,
      type: SyncOperationType.UPLOAD,
      status: SyncStatus.PENDING,
      startTime: new Date(),
      progress: 0,
      details: { localPath, cloudPath, metadata }
    };

    this.operations.set(operationId, operation);
    this.emit('operationStarted', operation);

    try {
      operation.status = SyncStatus.IN_PROGRESS;
      
      // Get file stats
      const stats = fs.statSync(localPath);
      const fileSize = stats.size;

      // Upload file with progress tracking
      const file = this.bucket.file(cloudPath);
      
      const uploadStream = file.createWriteStream({
        metadata: {
          contentType: this.getContentType(localPath),
          metadata: {
            ...metadata,
            uploadedBy: 'SophiaelGodModeAI',
            uploadTime: new Date().toISOString(),
            originalPath: localPath
          }
        },
        resumable: fileSize > 5 * 1024 * 1024 // Use resumable upload for files > 5MB
      });

      return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(localPath);
        let uploadedBytes = 0;

        readStream.on('data', (chunk: any) => {
          uploadedBytes += chunk.length;
          operation.progress = uploadedBytes / fileSize;
          this.emit('operationProgress', operation);
        });

        uploadStream.on('error', (error: Error) => {
          operation.status = SyncStatus.FAILED;
          operation.error = error.message;
          operation.endTime = new Date();
          this.updateStatistics(operation, false);
          this.emit('operationFailed', operation);
          reject(error);
        });

        uploadStream.on('finish', async () => {
          operation.status = SyncStatus.COMPLETED;
          operation.progress = 1.0;
          operation.endTime = new Date();
          
          // Update statistics
          this.updateStatistics(operation, true, fileSize);
          
          this.emit('operationCompleted', operation);
          resolve(operationId);
        });

        readStream.pipe(uploadStream);
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      operation.status = SyncStatus.FAILED;
      operation.error = errorMessage;
      operation.endTime = new Date();
      this.updateStatistics(operation, false);
      this.emit('operationFailed', operation);
      throw error;
    }
  }

  public async downloadFile(
    cloudPath: string, 
    localPath: string
  ): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('CloudSync not initialized');
    }

    const operationId = uuidv4();
    const operation: SyncOperation = {
      id: operationId,
      type: SyncOperationType.DOWNLOAD,
      status: SyncStatus.PENDING,
      startTime: new Date(),
      progress: 0,
      details: { cloudPath, localPath }
    };

    this.operations.set(operationId, operation);
    this.emit('operationStarted', operation);

    try {
      operation.status = SyncStatus.IN_PROGRESS;
      
      const file = this.bucket.file(cloudPath);
      
      // Check if file exists
      const [exists] = await file.exists();
      if (!exists) {
        throw new Error(`File not found in cloud: ${cloudPath}`);
      }

      // Get file metadata for progress tracking
      const [metadata] = await file.getMetadata();
      const fileSize = parseInt(metadata.size);

      // Ensure local directory exists
      const localDir = path.dirname(localPath);
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }

      return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(localPath);
        let downloadedBytes = 0;

        const readStream = file.createReadStream();

        readStream.on('data', (chunk: Buffer) => {
          downloadedBytes += chunk.length;
          operation.progress = downloadedBytes / fileSize;
          this.emit('operationProgress', operation);
        });

        readStream.on('error', (error: Error) => {
          operation.status = SyncStatus.FAILED;
          operation.error = error.message;
          operation.endTime = new Date();
          this.updateStatistics(operation, false);
          this.emit('operationFailed', operation);
          reject(error);
        });

        writeStream.on('finish', () => {
          operation.status = SyncStatus.COMPLETED;
          operation.progress = 1.0;
          operation.endTime = new Date();
          
          this.updateStatistics(operation, true, fileSize);
          this.emit('operationCompleted', operation);
          resolve(operationId);
        });

        readStream.pipe(writeStream);
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      operation.status = SyncStatus.FAILED;
      operation.error = errorMessage;
      operation.endTime = new Date();
      this.updateStatistics(operation, false);
      this.emit('operationFailed', operation);
      throw error;
    }
  }

  public async createBackup(
    localPaths: string[], 
    backupName?: string
  ): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('CloudSync not initialized');
    }

    const backupId = backupName || `backup_${Date.now()}`;
    const operationId = uuidv4();
    
    const operation: SyncOperation = {
      id: operationId,
      type: SyncOperationType.BACKUP,
      status: SyncStatus.PENDING,
      startTime: new Date(),
      progress: 0,
      details: { localPaths, backupId }
    };

    this.operations.set(operationId, operation);
    this.emit('operationStarted', operation);

    try {
      operation.status = SyncStatus.IN_PROGRESS;
      
      const files: CloudFile[] = [];
      let totalFiles = 0;
      let processedFiles = 0;

      // Count total files
      for (const localPath of localPaths) {
        totalFiles += this.countFiles(localPath);
      }

      // Upload each file
      for (const localPath of localPaths) {
        await this.backupPath(localPath, backupId, files, () => {
          processedFiles++;
          operation.progress = processedFiles / totalFiles;
          this.emit('operationProgress', operation);
        });
      }

      // Create backup manifest
      const manifest: BackupManifest = {
        id: backupId,
        timestamp: new Date(),
        version: '1.0.0',
        files,
        totalSize: files.reduce((sum, file) => sum + file.size, 0),
        checksum: this.calculateChecksum(files),
        compressed: false
      };

      // Upload manifest
      const manifestPath = `backups/${backupId}/manifest.json`;
      await this.uploadData(manifestPath, JSON.stringify(manifest, null, 2));

      operation.status = SyncStatus.COMPLETED;
      operation.progress = 1.0;
      operation.endTime = new Date();
      
      this.updateStatistics(operation, true);
      this.emit('operationCompleted', operation);
      
      return backupId;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      operation.status = SyncStatus.FAILED;
      operation.error = errorMessage;
      operation.endTime = new Date();
      this.updateStatistics(operation, false);
      this.emit('operationFailed', operation);
      throw error;
    }
  }

  public async restoreBackup(
    backupId: string, 
    restorePath: string
  ): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('CloudSync not initialized');
    }

    const operationId = uuidv4();
    const operation: SyncOperation = {
      id: operationId,
      type: SyncOperationType.RESTORE,
      status: SyncStatus.PENDING,
      startTime: new Date(),
      progress: 0,
      details: { backupId, restorePath }
    };

    this.operations.set(operationId, operation);
    this.emit('operationStarted', operation);

    try {
      operation.status = SyncStatus.IN_PROGRESS;
      
      // Download and parse manifest
      const manifestPath = `backups/${backupId}/manifest.json`;
      const manifestData = await this.downloadData(manifestPath);
      const manifest: BackupManifest = JSON.parse(manifestData);

      // Restore each file
      let processedFiles = 0;
      for (const file of manifest.files) {
        const cloudPath = `backups/${backupId}/${file.path}`;
        const localPath = path.join(restorePath, file.path);
        
        await this.downloadFile(cloudPath, localPath);
        
        processedFiles++;
        operation.progress = processedFiles / manifest.files.length;
        this.emit('operationProgress', operation);
      }

      operation.status = SyncStatus.COMPLETED;
      operation.progress = 1.0;
      operation.endTime = new Date();
      
      this.updateStatistics(operation, true);
      this.emit('operationCompleted', operation);
      
      return operationId;

    } catch (error) {
      operation.status = SyncStatus.FAILED;
      operation.error = error instanceof Error ? error.message : "Unknown error";
      operation.endTime = new Date();
      this.updateStatistics(operation, false);
      this.emit('operationFailed', operation);
      throw error;
    }
  }

  public async listBackups(): Promise<BackupManifest[]> {
    if (!this.isInitialized) {
      throw new Error('CloudSync not initialized');
    }

    try {
      const [files] = await this.bucket.getFiles({
        prefix: 'backups/',
        delimiter: '/'
      });

      const backups: BackupManifest[] = [];
      
      for (const file of files) {
        if (file.name.endsWith('/manifest.json')) {
          try {
            const [content] = await file.download();
            const manifest: BackupManifest = JSON.parse(content.toString());
            backups.push(manifest);
          } catch (error) {
            console.warn(`Failed to read backup manifest: ${file.name}`);
          }
        }
      }

      return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    } catch (error) {
      throw new Error(`Failed to list backups: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async syncDirectory(
    localPath: string, 
    cloudPath: string, 
    bidirectional: boolean = false
  ): Promise<string> {
    const operationId = uuidv4();
    const operation: SyncOperation = {
      id: operationId,
      type: SyncOperationType.SYNC,
      status: SyncStatus.PENDING,
      startTime: new Date(),
      progress: 0,
      details: { localPath, cloudPath, bidirectional }
    };

    this.operations.set(operationId, operation);
    this.emit('operationStarted', operation);

    try {
      operation.status = SyncStatus.IN_PROGRESS;
      
      // Get local files
      const localFiles = this.getLocalFiles(localPath);
      
      // Get cloud files
      const cloudFiles = await this.getCloudFiles(cloudPath);
      
      const syncPlan = this.createSyncPlan(localFiles, cloudFiles, bidirectional);
      
      let completedOperations = 0;
      const totalOperations = syncPlan.upload.length + syncPlan.download.length + syncPlan.delete.length;

      // Upload new/modified files
      for (const file of syncPlan.upload) {
        await this.uploadFile(
          path.join(localPath, file.relativePath),
          `${cloudPath}/${file.relativePath}`
        );
        completedOperations++;
        operation.progress = completedOperations / totalOperations;
        this.emit('operationProgress', operation);
      }

      // Download new/modified files (if bidirectional)
      if (bidirectional) {
        for (const file of syncPlan.download) {
          await this.downloadFile(
            `${cloudPath}/${file.relativePath}`,
            path.join(localPath, file.relativePath)
          );
          completedOperations++;
          operation.progress = completedOperations / totalOperations;
          this.emit('operationProgress', operation);
        }

        // Delete files (if bidirectional)
        for (const file of syncPlan.delete) {
          const localFilePath = path.join(localPath, file.relativePath);
          if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
          }
          completedOperations++;
          operation.progress = completedOperations / totalOperations;
          this.emit('operationProgress', operation);
        }
      }

      operation.status = SyncStatus.COMPLETED;
      operation.progress = 1.0;
      operation.endTime = new Date();
      
      this.updateStatistics(operation, true);
      this.emit('operationCompleted', operation);
      
      return operationId;

    } catch (error) {
      operation.status = SyncStatus.FAILED;
      operation.error = error instanceof Error ? error.message : "Unknown error";
      operation.endTime = new Date();
      this.updateStatistics(operation, false);
      this.emit('operationFailed', operation);
      throw error;
    }
  }

  public getOperationStatus(operationId: string): SyncOperation | undefined {
    return this.operations.get(operationId);
  }

  public getStatistics(): SyncStatistics {
    return { ...this.syncStatistics };
  }

  public async uploadData(cloudPath: string, data: string): Promise<void> {
    const file = this.bucket.file(cloudPath);
    await file.save(data, {
      metadata: {
        contentType: 'application/json'
      }
    });
  }

  public async downloadData(cloudPath: string): Promise<string> {
    const file = this.bucket.file(cloudPath);
    const [content] = await file.download();
    return content.toString();
  }

  // Private helper methods
  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.json': 'application/json',
      '.txt': 'text/plain',
      '.js': 'application/javascript',
      '.ts': 'application/typescript',
      '.html': 'text/html',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf'
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  private countFiles(dirPath: string): number {
    if (!fs.existsSync(dirPath)) return 0;
    
    const stat = fs.statSync(dirPath);
    if (stat.isFile()) return 1;
    
    let count = 0;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      count += this.countFiles(path.join(dirPath, file));
    }
    return count;
  }

  private async backupPath(
    localPath: string, 
    backupId: string, 
    files: CloudFile[], 
    progressCallback: () => void
  ): Promise<void> {
    const stat = fs.statSync(localPath);
    
    if (stat.isFile()) {
      const relativePath = path.basename(localPath);
      const cloudPath = `backups/${backupId}/${relativePath}`;
      
      await this.uploadFile(localPath, cloudPath);
      
      files.push({
        name: path.basename(localPath),
        path: relativePath,
        size: stat.size,
        lastModified: stat.mtime,
        contentType: this.getContentType(localPath),
        metadata: {},
        localPath
      });
      
      progressCallback();
    } else {
      const dirFiles = fs.readdirSync(localPath);
      for (const file of dirFiles) {
        await this.backupPath(
          path.join(localPath, file), 
          backupId, 
          files, 
          progressCallback
        );
      }
    }
  }

  private calculateChecksum(files: CloudFile[]): string {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    
    files.forEach(file => {
      hash.update(file.name + file.size + file.lastModified);
    });
    
    return hash.digest('hex');
  }

  private getLocalFiles(dirPath: string): any[] {
    // Implementation for getting local file list with metadata
    // This would recursively scan the directory
    return [];
  }

  private async getCloudFiles(cloudPath: string): Promise<any[]> {
    const [files] = await this.bucket.getFiles({ prefix: cloudPath });
    return files.map((file: any) => ({
      name: file.name,
      relativePath: file.name.replace(cloudPath + '/', '')
    }));
  }

  private createSyncPlan(localFiles: any[], cloudFiles: any[], bidirectional: boolean): any {
    // Implementation for creating sync plan comparing local vs cloud files
    return {
      upload: [],
      download: bidirectional ? [] : [],
      delete: bidirectional ? [] : []
    };
  }

  private updateStatistics(operation: SyncOperation, success: boolean, bytesTransferred: number = 0): void {
    this.syncStatistics.totalOperations++;
    
    if (success) {
      this.syncStatistics.successfulOperations++;
    } else {
      this.syncStatistics.failedOperations++;
    }
    
    this.syncStatistics.totalBytesTransferred += bytesTransferred;
    this.syncStatistics.lastSyncTime = new Date();
    
    // Calculate average transfer speed
    if (operation.endTime && operation.startTime) {
      const durationMs = operation.endTime.getTime() - operation.startTime.getTime();
      const durationSeconds = durationMs / 1000;
      if (durationSeconds > 0) {
        const currentSpeed = bytesTransferred / durationSeconds;
        this.syncStatistics.averageTransferSpeed = 
          (this.syncStatistics.averageTransferSpeed + currentSpeed) / 2;
      }
    }
  }

  private async updateStorageStatistics(): Promise<void> {
    try {
      const [files] = await this.bucket.getFiles();
      this.syncStatistics.cloudSpaceUsed = files.reduce((total: number, file: any) => {
        return total + parseInt(file.metadata.size || '0');
      }, 0);
      
      // Note: GCS doesn't have a direct quota API, so we'll set a large default
      this.syncStatistics.cloudSpaceAvailable = 1024 * 1024 * 1024 * 1024; // 1TB default
      
    } catch (error) {
      console.warn('Failed to update storage statistics:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}