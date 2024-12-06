import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  givenName: string;

  @ApiProperty()
  @IsString()
  familyName: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
