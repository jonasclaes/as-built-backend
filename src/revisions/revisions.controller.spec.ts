import { Test, TestingModule } from '@nestjs/testing';
import { RevisionsController } from './revisions.controller';
import { RevisionsService } from './revisions.service';
import { Revision } from './entities/revision.entity';
import { TENANT_DATA_SOURCE_NAME } from 'src/tenancy/tenancy.module';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RevisionsController', () => {
  let controller: RevisionsController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevisionsController],
      providers: [
        RevisionsService,
        {
          provide: getRepositoryToken(Revision, TENANT_DATA_SOURCE_NAME),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RevisionsController>(RevisionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
