import { ApiProperty } from '@nestjs/swagger';
import { ClientDto } from '../..//clients/dto/client.dto';

export class CreateProjectDto {
  @ApiProperty()
  name: string;
  @ApiProperty({ type: ClientDto })
  client: ClientDto;
}
