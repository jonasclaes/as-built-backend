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

  create(createFileDto: CreateFileDto) {
    return this.filesRepository.save(createFileDto);
  }

  async upload(fileName: string, file: Buffer) {
    const uploadParams = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'), // Ensure this is correctly set in your config
      Key: fileName,
      Body: file,
    };
    try {
      const result = await this.s3Client.send(
        new PutObjectCommand(uploadParams),
      );
      console.log('S3 upload result:', result);
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('File upload to S3 failed');
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
