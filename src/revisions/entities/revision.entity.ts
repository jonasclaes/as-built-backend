import { Project } from '../../projects/entities/project.entity';
import { Comment } from '../../comments/entities/comment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Revision {
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

  @ManyToOne(() => Project, (project) => project.revisions)
  project: Project;

  @ManyToMany(() => Comment, (comment) => comment.revisions)
  comments: Comment[];
}
