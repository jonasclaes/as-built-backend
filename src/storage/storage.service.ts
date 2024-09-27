import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinIOService } from './minio.service';
import { S3Service } from './s3.service';
import { StorageProvider } from './storage-provider.interface';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private storageProvider: StorageProvider;
  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinIOService,
    private readonly s3Service: S3Service,
  ) {
    const url = new URL(
      this.configService.getOrThrow<string>('STORAGE_ENDPOINT_URL'),
    );

    if (url.protocol === 'minio:') {
      this.storageProvider = this.minioService;
    } else if (url.protocol === 's3:') {
      this.storageProvider = this.s3Service;
    } else {
      throw new Error(`Unsupported storage protocol: ${url.protocol}`);
    }
  }

  async create(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    return await this.storageProvider.create(fileName, fileBuffer, mimeType);
  }

  async getFileUrl(fileName: string): Promise<string> {
    return await this.storageProvider.getFileUrl(fileName);
  }
  async download(fileName: string): Promise<Readable> {
    return await this.storageProvider.download(fileName);
  }
}
