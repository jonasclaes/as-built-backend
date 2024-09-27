import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Client } from '../clients/entities/client.entity';
import { Project } from '../projects/entities/project.entity';
import { Revision } from '..//revisions/entities/revision.entity';
import { File } from '../files/entities/file.entity';

export const ormConfig = {
  type: 'postgres',
  entities: [Tenant, Client, Project, Revision, File],
  migrations: [join(__dirname, '../migrations/**/*.{ts,js}')],
  synchronize: false,
} satisfies DataSourceOptions;

export default ormConfig;
