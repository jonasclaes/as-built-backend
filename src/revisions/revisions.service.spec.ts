import { Test, TestingModule } from '@nestjs/testing';
import { RevisionsService } from './revisions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Revision } from './entities/revision.entity';
import { TENANT_DATA_SOURCE_NAME } from '../tenancy/tenancy.module';

describe('RevisionsService', () => {
  let service: RevisionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RevisionsService,
        {
          provide: getRepositoryToken(Revision, TENANT_DATA_SOURCE_NAME),
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<RevisionsService>(RevisionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
