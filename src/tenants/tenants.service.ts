import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { DataSource, Repository } from 'typeorm';
import ormConfig from 'src/typeorm/orm.config';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    await this.dataSource
      .createQueryRunner()
      .createDatabase(createTenantDto.name, false);

    // FIXME: Add proper URL parsing logic to replace any database name with the tenant name
    createTenantDto.connectionString = ormConfig.url.replace(
      'nest',
      createTenantDto.name,
    );

    return await this.tenantRepository.save(createTenantDto);
  }

  findAll() {
    return this.tenantRepository.find();
  }

  findOne(id: number) {
    return this.tenantRepository.findOneBy({ id });
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return this.tenantRepository.update(id, updateTenantDto);
  }

  remove(id: number) {
    // FIXME: Add handling to drop the database
    return this.tenantRepository.delete(id);
  }
}
