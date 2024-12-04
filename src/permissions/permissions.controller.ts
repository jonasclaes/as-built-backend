import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post(':uid/tenants/:tenantId')
  async assignPermission(
    @Param('uid') userUid: string,
    @Param('tenantId') tenantId: number,
    @Body('permissionName') permissionName: string,
  ) {
    return this.permissionsService.assignPermission(
      userUid,
      tenantId,
      permissionName,
    );
  }

  @Get(':uid/tenants/:tenantId')
  async getPermissions(
    @Param('uid') userUid: string,
    @Param('tenantId') tenantId: number,
  ) {
    return this.permissionsService.getPermissions(userUid, tenantId);
  }

  @Delete(':id')
  async revokePermission(@Param('id') permissionId: number) {
    return this.permissionsService.revokePermission(permissionId);
  }
}
