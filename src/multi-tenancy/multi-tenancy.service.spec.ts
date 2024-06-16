import { Test, TestingModule } from '@nestjs/testing';
import { MultiTenancyService } from './multi-tenancy.service';
import { TENANT_DATA_SOURCE } from '../tenancy/tenancy.module';

describe('MultiTenancyService', () => {
  let service: MultiTenancyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MultiTenancyService,
        {
          provide: TENANT_DATA_SOURCE,
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<MultiTenancyService>(MultiTenancyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
