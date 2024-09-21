import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Revision } from '../../revisions/entities/revision.entity';

@Entity()
export class File {
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
  path: string;

  @ManyToMany(() => Revision, (revision) => revision.files)
  @JoinTable({ name: 'file_revisions' })
  revisions: Revision[];
}
