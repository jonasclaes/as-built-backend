import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { TENANT_DATA_SOURCE_NAME } from '../tenancy/tenancy.module';
import { Repository } from 'typeorm';

export const repositoryMockFactory = jest.fn(() => ({
  find: jest.fn((entity) => entity),
  findOneBy: jest.fn((entity) => entity),
}));

describe('ClientsService', () => {
  let service: ClientsService;
  let repositoryMock: jest.Mocked<Repository<Client>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client, TENANT_DATA_SOURCE_NAME),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    repositoryMock = module.get(
      getRepositoryToken(Client, TENANT_DATA_SOURCE_NAME),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all clients', async () => {
    const clients: Client[] = [
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        id: 1,
        name: 'Test',
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        id: 2,
        name: 'Test',
      },
    ];

    repositoryMock.find.mockResolvedValue(clients);
    expect(await service.findAll()).toEqual(clients);
    expect(repositoryMock.find).toHaveBeenCalled();
  });

  it('should find a client', async () => {
    const client: Client = {
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      id: 1,
      name: 'Test',
    };

    repositoryMock.findOneBy.mockResolvedValue(client);
    expect(await service.findOne(client.id)).toEqual(client);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: client.id });
  });
});
