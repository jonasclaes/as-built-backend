import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
        secretAccessKey:
          this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
      },
      endpoint: this.configService.getOrThrow<string>('MINIO_ENDPOINT'),
      region: this.configService.get<string>('MINIO_REGION'),
      forcePathStyle: true,
    });
    this.bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
  }

  async uploadFile(
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

    await this.s3Client.send(new PutObjectCommand(uploadParams));
    return this.getFileUrl(fileName);
  }

  getFileUrl(fileName: string): string {
    const endpoint = this.configService.getOrThrow<string>('MINIO_ENDPOINT');
    const bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
    return `${endpoint}/${bucketName}/${fileName}`;
  }
}
