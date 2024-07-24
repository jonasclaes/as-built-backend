import { Injectable, Scope } from '@nestjs/common';
import { InjectTenantRepository } from 'src/tenancy/tenancy.decorators';
import { Revision } from './entities/revision.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Repository } from 'typeorm';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateRevisionDto } from './dto/update-revision.dto';

@Injectable({ scope: Scope.REQUEST })
export class RevisionsService {
  constructor(
    @InjectTenantRepository(Revision)
    private readonly revisionRepository: Repository<Revision>,
    @InjectTenantRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}
  create(createRevisionDto: CreateRevisionDto) {
    return this.revisionRepository.save(createRevisionDto);
  }
  findAll() {
    return this.revisionRepository.find();
  }
  findOne(id: number) {
    return this.revisionRepository.findOneBy({ id });
  }
  update(id: number, updateRevisionDto: UpdateRevisionDto) {
    return this.revisionRepository.update(id, updateRevisionDto);
  }
  remove(id: number) {
    return this.revisionRepository.delete(id);
  }
}
