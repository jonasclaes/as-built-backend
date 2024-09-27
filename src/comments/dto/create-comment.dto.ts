import { ApiProperty } from '@nestjs/swagger';
import { Revision } from '../../revisions/entities/revision.entity';

export class CreateCommentDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  revision: Revision['id'];
}
