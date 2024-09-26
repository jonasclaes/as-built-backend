import { ApiProperty } from '@nestjs/swagger';
import { Revision } from '../../revisions/entities/revision.entity';

export class CreateCommentDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: 'number', required: true })
  revision: Revision['id'];
}
