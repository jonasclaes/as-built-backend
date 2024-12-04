import { Tenant } from '../../tenants/entities/tenant.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.permissions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Tenant, (tenant) => tenant.permissions, {
    onDelete: 'CASCADE',
  })
  tenant: Tenant;

  @Column()
  permission: string;
}
