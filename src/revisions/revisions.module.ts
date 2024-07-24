import { Module } from '@nestjs/common';
import { Project } from 'src/projects/entities/project.entity';
import { TenancyOrmModule } from 'src/tenancy/tenancyOrm.module';
import { Revision } from './entities/revision.entity';
import { RevisionsController } from './revisions.controller';
import { RevisionsService } from './revisions.service';

@Module({
  imports: [TenancyOrmModule.forFeature([Revision, Project])],
  controllers: [RevisionsController],
  providers: [RevisionsService],
})
export class RevisionsModule {}
