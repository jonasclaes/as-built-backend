import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { MinioService } from './minio.service';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModule],
  providers: [StorageService, MinioService, S3Service],
  exports: [StorageService],
})
export class StorageModule {}
