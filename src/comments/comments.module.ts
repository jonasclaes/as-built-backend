import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TenancyOrmModule } from '../tenancy/tenancyOrm.module';
import { Revision } from '../revisions/entities/revision.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TenancyOrmModule.forFeature([Comment, Revision])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
