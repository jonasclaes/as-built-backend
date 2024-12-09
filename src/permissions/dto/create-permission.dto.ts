import { ApiProperty } from '@nestjs/swagger';
import { PermissionName } from '../entities/permissions.enum';

export class CreatePermissionDto {
  @ApiProperty({
    enum: PermissionName,
    enumName: 'PermissionName',
  })
  name: PermissionName;
}
