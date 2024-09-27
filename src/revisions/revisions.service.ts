import { Injectable, NotFoundException, Scope } from '@nestjs/common';
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

  async duplicateRevision(id: number, createRevisionDto: CreateRevisionDto) {
    const originalRevision = await this.revisionRepository.findOne({
      where: { id },
      relations: ['comments', 'files'],
    });
    if (!originalRevision) {
      throw new NotFoundException(`Revision with id ${id} is not found`);
    }
    const newRevision = this.revisionRepository.create({
      name: createRevisionDto.name,
      project: createRevisionDto.project,
      comments: [...originalRevision.comments],
      files: [...originalRevision.files],
    });
    return await this.revisionRepository.save(newRevision);
  }

  async removeCommentFromRevision(revisionId: number, commentId: number) {
    const revision = await this.revisionRepository.findOne({
      where: { id: revisionId },
      relations: ['comments'],
    });
    if (!revision) {
      throw new NotFoundException(
        `Revision with ID ${revisionId} is not found`,
      );
    }
    revision.comments = revision.comments.filter(
      (comment) => comment.id !== commentId,
    );
    await this.revisionRepository.save(revision);
  }
}
