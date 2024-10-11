import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { TENANT_DATA_SOURCE_NAME } from '../tenancy/tenancy.module';
import { StorageService } from '../storage/storage.service'; // Importeer StorageService

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(File, TENANT_DATA_SOURCE_NAME),
          useValue: {},
        },
        {
          provide: StorageService,
          useValue: {
            create: jest.fn(),
            download: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
