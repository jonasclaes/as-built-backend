import { ApiProperty } from '@nestjs/swagger';
import { Revision } from '../../revisions/entities/revision.entity';

export class CreateFileDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;

  @ApiProperty()
  fileName: string;

  @ApiProperty({ type: 'number', required: true })
  revisionId: Revision['id'];
}
