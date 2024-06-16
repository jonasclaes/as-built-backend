import { InjectRepository } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { TENANT_DATA_SOURCE_NAME } from './tenancy.module';

export const InjectTenantRepository = (
  entity: EntityClassOrSchema,
): ReturnType<typeof InjectRepository> =>
  InjectRepository(entity, TENANT_DATA_SOURCE_NAME);
