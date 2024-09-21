import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_KEY'),
      },
      region: this.configService.getOrThrow<string>('S3_REGION'),
    });
    this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET');
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
    return `https://s3.amazonaws.com/${this.bucketName}/${fileName}`;
  }
}
