import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { PermissionName } from './permissions.enum';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.permissions)
  user: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.permissions)
  tenant: Tenant;

  @Column({
    type: 'enum',
    enum: PermissionName,
  })
  name: PermissionName;
}
