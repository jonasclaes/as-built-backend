import { Permission } from '../../permissions/entities/permission.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  name: string;

  @Column()
  connectionString: string;

  @Column({ nullable: true })
  ownerUid: string;

  @ManyToMany(() => User, (user) => user.tenants)
  @JoinTable({ name: 'tenants_users' })
  users: User[];

  @OneToMany(() => Permission, (permission) => permission.tenant)
  permissions: Permission[];
}
