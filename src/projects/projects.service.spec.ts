import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from './entities/project.entity'; // Assuming you have a Project entity
import { TENANT_DATA_SOURCE_NAME } from '../tenancy/tenancy.module'; // Assuming tenant setup

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project, TENANT_DATA_SOURCE_NAME),
          useValue: {},
        },
        {
          provide: 'tenant_ClientRepository',
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
