import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TenancyOrmModule } from '../tenancy/tenancyOrm.module';
import { Project } from './entities/project.entity';
import { Client } from 'src/clients/entities/client.entity';

@Module({
  imports: [TenancyOrmModule.forFeature([Project, Client])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
