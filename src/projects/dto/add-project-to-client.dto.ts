import { ApiProperty } from '@nestjs/swagger';

export class AddProjectToClientDto {
  @ApiProperty()
  clientId: number;

  @ApiProperty()
  projectId: number;
}
