import { Injectable, Scope } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectTenantRepository } from '../tenancy/tenancy.decorators';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable({ scope: Scope.REQUEST })
export class CommentsService {
  constructor(
    @InjectTenantRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto) {
    const { title, description, revision } = createCommentDto;
    const newComment = this.commentRepository.create({
      title,
      description,
      revisions: [{ id: revision }],
    });
    return this.commentRepository.save(newComment);
  }

  findAll() {
    return this.commentRepository.find();
  }

  findAllCommentsForRevision(revisionId: number) {
    return this.commentRepository.find({
      where: { revisions: { id: revisionId } },
    });
  }

  findOne(id: number) {
    return this.commentRepository.findOneBy({ id });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentRepository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentRepository.delete(id);
  }
}
