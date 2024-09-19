import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectTenantRepository } from '../tenancy/tenancy.decorators';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Revision } from '../revisions/entities/revision.entity';

@Injectable()
export class FilesService {
  private readonly s3Client: S3Client;

  constructor(
    @InjectTenantRepository(File)
    private readonly filesRepository: Repository<File>,
    private readonly configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
        secretAccessKey:
          this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
      },
      endpoint: this.configService.getOrThrow<string>('MINIO_ENDPOINT'),
      region: this.configService.get<string>('MINIO_REGION', 'us-east-1'),
      forcePathStyle: true,
    });
  }

  async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    fileDto: CreateFileDto,
    mimeType: string,
  ) {
    const bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');

    const uploadParams = {
      Bucket: bucketName,
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimeType,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      const fileUri = this.getS3FileUri(bucketName, fileName);
      const newFile = this.filesRepository.create({
        name: fileName,
        path: fileUri,
      });

      const savedFile = await this.filesRepository.save(newFile);

      const revision = await this.filesRepository.manager.findOneBy(Revision, {
        id: fileDto.revisionId,
      });
      if (!revision) {
        throw new Error(`Revision with ID ${fileDto.revisionId} not found`);
      }

      savedFile.revisions = [revision];
      await this.filesRepository.save(savedFile);

      return savedFile;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  private getS3FileUri(bucketName: string, fileName: string) {
    const endpoint = this.configService.getOrThrow<string>('MINIO_ENDPOINT');

    return `${endpoint}/${bucketName}/${fileName}`;
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
