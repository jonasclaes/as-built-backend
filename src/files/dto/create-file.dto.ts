import { ApiProperty } from '@nestjs/swagger';
import { Revision } from '../../revisions/entities/revision.entity';

export class CreateFileDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  revisionId: Revision;
}
