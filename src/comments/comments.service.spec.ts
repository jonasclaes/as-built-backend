import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { TENANT_DATA_SOURCE_NAME } from '../tenancy/tenancy.module';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment, TENANT_DATA_SOURCE_NAME),
          useValue: {}, // Mock the tenant_CommentRepository
        },
      ],
    }).compile();

    service = await module.resolve<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
