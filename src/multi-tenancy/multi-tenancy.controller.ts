import { Controller, Post } from '@nestjs/common';
import { MultiTenancyService } from './multi-tenancy.service';
import { ApiHeader } from '@nestjs/swagger';

@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant ID',
})
@Controller('multi-tenancy')
export class MultiTenancyController {
  constructor(private readonly multiTenancyService: MultiTenancyService) {}

  @Post()
  create() {
    return this.multiTenancyService.migrateTenant();
  }
}
