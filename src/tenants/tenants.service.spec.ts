import { Test, TestingModule } from '@nestjs/testing';
import { TenantsService } from './tenants.service';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

describe('TenantsService', () => {
  let service: TenantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        {
          provide: getRepositoryToken(Tenant),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getDataSourceToken(),
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
