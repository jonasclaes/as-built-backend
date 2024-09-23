import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { StorageProvider } from './storage-provider.interface';

@Injectable()
export class MinIOService implements StorageProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly url: URL;
  private readonly proto: string;

  constructor(private readonly configService: ConfigService) {
    this.url = new URL(
      this.configService.getOrThrow<string>('STORAGE_ENDPOINT_URL'),
    );

    const region = this.url.searchParams.get('region');
    if (!region) {
      throw new Error("Missing 'region' query parameter in the storage URL.");
    }

    this.proto =
      this.url.searchParams.get('secure') === 'false' ? 'http' : 'https';
    this.bucketName = this.url.pathname.split('/')[1];

    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.url.username,
        secretAccessKey: this.url.password,
      },
      endpoint: `${this.proto}://${this.url.host}`,
      region,
      forcePathStyle: true,
    });
  }

  async create(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const putObjectCommand = new PutObjectCommand({
      Bucket: this.bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimeType,
    });

    await this.s3Client.send(putObjectCommand);

    return this.getFileUrl(fileName);
  }

  async getFileUrl(fileName: string): Promise<string> {
    return `${this.proto}://${this.url.host}/${this.bucketName}/${fileName}`;
  }
}
