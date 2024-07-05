import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../../clients/entities/client.entity';

export class CreateProjectDto {
  @ApiProperty()
  name: string;
  @ApiProperty({ type: Client, properties: { id: { type: 'number' } } })
  client: { id: number };
}
