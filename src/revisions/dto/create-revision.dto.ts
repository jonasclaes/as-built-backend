import { ApiProperty } from '@nestjs/swagger';
import { Project } from '../../projects/entities/project.entity';

export class CreateRevisionDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  project: Project;
}
