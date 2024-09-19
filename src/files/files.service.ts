import { Injectable, Scope } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectTenantRepository } from '../tenancy/tenancy.decorators';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { ConfigService } from '@nestjs/config';
import { Client as MinioClient } from 'minio';

@Injectable({ scope: Scope.REQUEST })
export class FilesService {
  private readonly minioClient: MinioClient;

  constructor(
    @InjectTenantRepository(File)
    private readonly filesRepository: Repository<File>,
    private readonly configService: ConfigService,
  ) {
    // Initialize MinIO client using environment variables
    this.minioClient = new MinioClient({
      endPoint: this.configService.getOrThrow<string>('MINIO_ENDPOINT'),
      port: parseInt(this.configService.getOrThrow<string>('MINIO_PORT')),
      useSSL: this.configService.getOrThrow<string>('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.getOrThrow<string>('MINIO_ACCESSKEY'),
      secretKey: this.configService.getOrThrow<string>('MINIO_SECRETKEY'),
    });
  }

  async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    fileDto: CreateFileDto,
  ): Promise<File> {
    const bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
    try {
      // Ensure the bucket exists
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, '');
      }

      // Upload the file to MinIO
      await this.minioClient.putObject(bucketName, fileName, fileBuffer);

      // Generate the file URI
      const fileUri = this.getMinioFileUri(bucketName, fileName);

      // Save file details in the database
      const newFile = this.filesRepository.create({
        ...fileDto,
        name: fileName,
        path: fileUri,
      });
      return await this.filesRepository.save(newFile);
    } catch (error) {
      throw new Error(`Failed to upload file to MinIO: ${error}`);
    }
  }

  // Generate a MinIO file URL
  private getMinioFileUri(bucketName: string, fileName: string): string {
    const endpoint = this.configService.getOrThrow<string>('MINIO_ENDPOINT');
    const port = this.configService.getOrThrow<string>('MINIO_PORT');
    return `http://${endpoint}:${port}/${bucketName}/${fileName}`;
  }
  findAll() {
    return this.filesRepository.find();
  }

  findOne(id: number) {
    return this.filesRepository.findOneBy({ id });
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return this.filesRepository.update(id, updateFileDto);
  }

  remove(id: number) {
    return this.filesRepository.delete(id);
  }
}
