import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { MinIOService } from './minio.service';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModule],
  providers: [StorageService, MinIOService, S3Service],
  exports: [StorageService],
})
export class StorageModule {}
