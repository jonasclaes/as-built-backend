import { Injectable, Scope } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { InjectTenantRepository } from '../tenancy/tenancy.decorators';

@Injectable({ scope: Scope.REQUEST })
export class ClientsService {
  constructor(
    @InjectTenantRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  create(createClientDto: CreateClientDto) {
    return this.clientsRepository.save(createClientDto);
  }

  findAll() {
    return this.clientsRepository.find();
  }

  findOne(id: number) {
    return this.clientsRepository.findOneBy({ id });
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return this.clientsRepository.update(id, updateClientDto);
  }

  remove(id: number) {
    return this.clientsRepository.delete(id);
  }
}
