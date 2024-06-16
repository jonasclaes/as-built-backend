import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TENANT_DATA_SOURCE } from '../tenancy/tenancy.module';

@Injectable({ scope: Scope.REQUEST })
export class MultiTenancyService {
  constructor(
    @Inject(TENANT_DATA_SOURCE)
    private readonly tenantDataSource: DataSource,
  ) {}

  migrateTenant() {
    return this.tenantDataSource.runMigrations();
  }
}
