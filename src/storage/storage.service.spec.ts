import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { ConfigService } from '@nestjs/config';
import { MinIOService } from './minio.service';
import { S3Service } from './s3.service';

// Mock classes for MinIOService and S3Service
class MockMinIOService {
  create = jest.fn();
  getFileUrl = jest.fn();
  download = jest.fn();
}

class MockS3Service {
  create = jest.fn();
  getFileUrl = jest.fn();
  download = jest.fn();
}

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('minio://example.com'),
          },
        },
        {
          provide: MinIOService,
          useClass: MockMinIOService,
        },
        {
          provide: S3Service,
          useClass: MockS3Service,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
