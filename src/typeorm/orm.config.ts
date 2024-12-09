import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { Tenant } from '../tenants/entities/tenant.entity';
import { Client } from '../clients/entities/client.entity';
import { Project } from '../projects/entities/project.entity';
import { Revision } from '../revisions/entities/revision.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { File } from '../files/entities/file.entity';
import { User } from '../users/entities/user.entity';

export const ormConfig = {
  type: 'postgres',
  entities: [
    Tenant,
    Client,
    Project,
    Revision,
    Comment,
    File,
    User,
    Permission,
  ],
  migrations: [join(__dirname, '../migrations/**/*.{ts,js}')],
  synchronize: false,
} satisfies DataSourceOptions;

export default ormConfig;
