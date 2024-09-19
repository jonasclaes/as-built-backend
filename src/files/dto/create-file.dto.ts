import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  revisionId: number;
}
