import { Tenant } from '../../tenants/entities/tenant.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string;

  @ManyToMany(() => Tenant, (tenant) => tenant.users)
  tenants: Tenant[];
}
