import { Tenant } from '../../tenants/entities/tenant.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @ManyToMany(() => Tenant, (tenant) => tenant.users)
  tenants: Tenant[];

  @OneToMany(() => Permission, (permission) => permission.user)
  permissions: Permission[];
}
