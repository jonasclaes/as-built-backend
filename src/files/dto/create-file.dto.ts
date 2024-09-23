import { ApiProperty } from '@nestjs/swagger';
import { Revision } from 'src/revisions/entities/revision.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty()
  name: string;

  @ApiProperty()
  mineType: string;

  @ApiProperty()
  @IsNotEmpty()
  revision: Revision;
}
