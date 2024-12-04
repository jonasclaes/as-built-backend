import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { Tenant } from '../tenants/entities/tenant.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async assignPermission(
    userUid: string,
    tenantId: number,
    permissionName: string,
  ): Promise<Permission> {
    const user = await this.userRepository.findOne({ where: { uid: userUid } });
    if (!user) {
      throw new Error('User not found');
    }

    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const permission = new Permission();
    permission.user = user;
    permission.tenant = tenant;
    permission.permission = permissionName;

    return await this.permissionRepository.save(permission);
  }

  async getPermissions(
    userUid: string,
    tenantId: number,
  ): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: {
        user: { uid: userUid },
        tenant: { id: tenantId },
      },
      relations: ['user', 'tenant'],
    });
  }

  async revokePermission(permissionId: number): Promise<void> {
    await this.permissionRepository.delete(permissionId);
  }
}
