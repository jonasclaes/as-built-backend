import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from './storage-provider.interface';

@Injectable()
export class MinioService implements StorageProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  url: URL;

  constructor(private readonly configService: ConfigService) {
    this.url = new URL(
      this.configService.getOrThrow<string>('STORAGE_ENDPOINT_URL'),
    );

    const region = this.url.searchParams.get('region') || 'eu-west-1'; // default region if not provided

    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.url.username,
        secretAccessKey: this.url.password,
      },
      endpoint: `https://${this.url.hostname}`,
      region: region,
      forcePathStyle: true,
    });
    this.bucketName = this.url.pathname.replace(/^\//, '');
  }

  async create(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const uploadParams = {
      Bucket: this.bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimeType,
    };

    console.log('Upload Parameters:', uploadParams); // Debugging line

    await this.s3Client.send(new PutObjectCommand(uploadParams));
    return this.getFileUrl(fileName);
  }

  async getFileUrl(fileName: string): Promise<string> {
    return `${this.url.href}/${fileName}`;
  }
}
