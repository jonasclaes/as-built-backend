import { FactoryProvider, Global, Module, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { TenancyFactory } from './tenancy.factory';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { Tenant } from '../tenants/entities/tenant.entity';

export const TENANT_DATA_SOURCE_NAME = 'tenant';
export const TENANT_DATA_SOURCE = getDataSourceToken(TENANT_DATA_SOURCE_NAME);

export const connectionFactory: FactoryProvider<DataSource | null> = {
  provide: TENANT_DATA_SOURCE,
  scope: Scope.REQUEST,
  useFactory: (tenancyFactory: TenancyFactory) => {
    return tenancyFactory.create();
  },
  inject: [TenancyFactory],
};

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenancyFactory, connectionFactory],
  exports: [TENANT_DATA_SOURCE],
})
export class TenancyModule {}
