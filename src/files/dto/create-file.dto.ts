import { ApiProperty } from '@nestjs/swagger';
import { Revision } from 'src/revisions/entities/revision.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  revisionId: Revision;
}
