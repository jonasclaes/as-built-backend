import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { TENANT_DATA_SOURCE_NAME } from './tenancy.module';

@Global()
@Module({})
export class TenancyOrmModule {
  static forFeature(entities: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(entities, TENANT_DATA_SOURCE_NAME);
  }
}
