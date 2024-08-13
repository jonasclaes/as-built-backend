import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectTenantRepository } from '../tenancy/tenancy.decorators';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectTenantRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}

  create(createFileDto: CreateFileDto) {
    return this.filesRepository.save(createFileDto);
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
