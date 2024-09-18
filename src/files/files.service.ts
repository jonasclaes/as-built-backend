import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectTenantRepository } from '../tenancy/tenancy.decorators';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class FilesService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
  });

  constructor(
    @InjectTenantRepository(File)
    private readonly filesRepository: Repository<File>,
    private readonly configService: ConfigService,
  ) {}

  async create(fileName: string, fileBuffer: Buffer, fileDto: CreateFileDto) {
    const uploadParams = {
      Bucket: this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Body: fileBuffer,
    };
    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      const newFile = this.filesRepository.create({
        ...fileDto,
        name: fileName,
        path: fileName,
      });
      return await this.filesRepository.save(newFile);
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error}`);
    }
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
