import { Revision } from '../../revisions/entities/revision.entity';
import { Client } from '../../clients/entities/client.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Project {
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

  @ManyToOne(() => Client, (client) => client.projects)
  client: Client;

  @OneToMany(() => Revision, (revision) => revision.project)
  revisions: Revision[];
}
