import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from './minio.service';
import { S3Service } from './s3.service';

@Injectable()
export class StorageService {
  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
    private readonly s3Service: S3Service,
  ) {}

  async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const storageUri = this.configService.getOrThrow<string>(
      'STORAGE_ENDPOINT_URI',
    );
    const { protocol } = new URL(storageUri);

    if (protocol === 'minio:') {
      return await this.minioService.uploadFile(fileName, fileBuffer, mimeType);
    } else if (protocol === 's3:') {
      return await this.s3Service.uploadFile(fileName, fileBuffer, mimeType);
    } else {
      throw new Error(`Unsupported storage protocol: ${protocol}`);
    }
  }

  async getFileUrl(fileName: string): Promise<string> {
    const storageUri = this.configService.getOrThrow<string>(
      'STORAGE_ENDPOINT_URI',
    );
    const { protocol } = new URL(storageUri);

    if (protocol === 'minio:') {
      return this.minioService.getFileUrl(fileName);
    } else if (protocol === 's3:') {
      return this.s3Service.getFileUrl(fileName);
    } else {
      throw new Error(`Unsupported storage protocol: ${protocol}`);
    }
  }
}
