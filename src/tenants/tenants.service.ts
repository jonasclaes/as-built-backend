import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async create(createTenantDto: CreateTenantDto) {
    await this.dataSource
      .createQueryRunner()
      .createDatabase(createTenantDto.name, false);

    const systemDatabaseUrl = new URL(
      this.configService.get('DATABASE_URL') ?? '',
    );

    systemDatabaseUrl.pathname = `/${createTenantDto.name}`;

    createTenantDto.connectionString = systemDatabaseUrl.toString();

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

  async assignTenantToUser(userId: number, tenantId: number): Promise<Tenant> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tenants'],
    });
    if (!user) {
      throw new Error('User not found');
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    if (!user.tenants.some((t) => t.id === tenantId)) {
      user.tenants.push(tenant);
      await this.userRepository.save(user);
    }
    return tenant;
  }
}
