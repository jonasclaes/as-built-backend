import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post(':userId/tenants/:tenantId')
  async assignPermission(
    @Param('userId') userId: number,
    @Param('tenantId') tenantId: number,
    @Body() createPermissionDto: CreatePermissionDto,
  ) {
    return this.permissionsService.assignPermission(
      userId,
      tenantId,
      createPermissionDto.name,
    );
  }

  @Get(':userId/tenants/:tenantId')
  async getPermissions(
    @Param('userId') userId: number,
    @Param('tenantId') tenantId: number,
  ) {
    return this.permissionsService.getPermissions(userId, tenantId);
  }

  @Delete(':id')
  async revokePermission(@Param('id') permissionId: number) {
    return this.permissionsService.revokePermission(permissionId);
  }
}
