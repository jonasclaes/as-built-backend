import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectTenantRepository } from '../tenancy/tenancy.decorators';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { Revision } from '../revisions/entities/revision.entity';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectTenantRepository(File)
    private readonly filesRepository: Repository<File>,
    private readonly storageService: StorageService,
  ) {}

  async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    fileDto: CreateFileDto,
    mimeType: string,
  ) {
    const fileUri = await this.storageService.uploadFile(
      fileName,
      fileBuffer,
      mimeType,
    );

    const newFile = this.filesRepository.create({
      name: fileName,
      path: fileUri,
    });

    const savedFile = await this.filesRepository.save(newFile);

    const revision = await this.filesRepository.manager.findOneBy(Revision, {
      id: fileDto.revisionId.id,
    });

    if (!revision) {
      throw new Error(`Revision with ID ${fileDto.revisionId} not found`);
    }

    savedFile.revisions = [revision];
    await this.filesRepository.save(savedFile);
    return savedFile;
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
