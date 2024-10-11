import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TenancyOrmModule } from '../tenancy/tenancyOrm.module';
import { File } from './entities/file.entity';
import { Revision } from '../revisions/entities/revision.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [TenancyOrmModule.forFeature([File, Revision]), StorageModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
