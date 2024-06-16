import { Test, TestingModule } from '@nestjs/testing';
import { MultiTenancyController } from './multi-tenancy.controller';
import { MultiTenancyService } from './multi-tenancy.service';
import { TENANT_DATA_SOURCE } from '../tenancy/tenancy.module';

describe('MultiTenancyController', () => {
  let controller: MultiTenancyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MultiTenancyController],
      providers: [
        MultiTenancyService,
        {
          provide: TENANT_DATA_SOURCE,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MultiTenancyController>(MultiTenancyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
