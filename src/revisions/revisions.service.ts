import { Injectable, Scope } from '@nestjs/common';
import { InjectTenantRepository } from '../tenancy/tenancy.decorators';
import { Revision } from './entities/revision.entity';
import { Repository } from 'typeorm';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateRevisionDto } from './dto/update-revision.dto';

@Injectable({ scope: Scope.REQUEST })
export class RevisionsService {
  constructor(
    @InjectTenantRepository(Revision)
    private readonly revisionRepository: Repository<Revision>,
  ) {}

  create(createRevisionDto: CreateRevisionDto) {
    return this.revisionRepository.save(createRevisionDto);
  }

  findAll() {
    return this.revisionRepository.find();
  }

  findAllForProject(projectId: number) {
    return this.revisionRepository.find({
      where: { project: { id: projectId } },
    });
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
