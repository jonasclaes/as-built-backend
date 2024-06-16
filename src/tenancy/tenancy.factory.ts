import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Tenant } from '../tenants/entities/tenant.entity';
import { DataSource, Repository } from 'typeorm';
import { TENANT_DATA_SOURCE_NAME } from './tenancy.module';
import { ormConfig } from '../typeorm/orm.config';

@Injectable({ scope: Scope.REQUEST })
export class TenancyFactory {
  private readonly logger = new Logger(TenancyFactory.name);

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async create(): Promise<DataSource> {
    const tenantIdString = this.request.headers['x-tenant-id'] as string;

    if (tenantIdString && !isNaN(parseInt(tenantIdString, 10))) {
      const tenantId = parseInt(tenantIdString, 10);

      const tenant = await this.tenantRepository.findOneBy({ id: tenantId });

      if (!tenant) {
        throw new HttpException('Tenant not found', 404);
      }

      const dataSource = new DataSource({
        ...ormConfig,
        url: tenant.connectionString,
        name: TENANT_DATA_SOURCE_NAME,
        synchronize: false,
      });

      await dataSource.initialize();

      return dataSource;
    }

    throw new HttpException('Header "x-tenant-id" is required', 400);
  }
}
