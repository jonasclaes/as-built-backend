import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectTenantRepository } from '../tenancy/tenancy.decorators';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectTenantRepository(File)
    private readonly filesRepository: Repository<File>,
    private readonly storageService: StorageService,
  ) {}

  async create(createFileDto: CreateFileDto) {
    const { file, fileName, revisionId } = createFileDto;

    const fileUrl = await this.storageService.create(
      fileName,
      file.buffer,
      file.mimetype,
    );

    const newFile = this.filesRepository.create({
      name: fileName,
      path: fileUrl,
      revisions: [
        {
          id: revisionId,
        },
      ],
    });

    const savedFile = await this.filesRepository.save(newFile);

    return savedFile;
  }

  findAll() {
    return this.filesRepository.find();
  }

  findOne(id: number) {
    return this.filesRepository.findOneBy({ id });
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    const { file } = updateFileDto;

    if (!file) throw new Error('File is a required attribute.');

    return this.filesRepository.update(id, {
      name: file.filename,
    });
  }

  remove(id: number) {
    return this.filesRepository.delete(id);
  }
}
