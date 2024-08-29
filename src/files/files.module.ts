import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TenancyOrmModule } from '../tenancy/tenancyOrm.module';
import { File } from './entities/file.entity';
import { Revision } from '../revisions/entities/revision.entity';

@Module({
  imports: [TenancyOrmModule.forFeature([File, Revision])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
