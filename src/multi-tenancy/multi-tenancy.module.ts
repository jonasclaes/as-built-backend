import { Module } from '@nestjs/common';
import { MultiTenancyService } from './multi-tenancy.service';
import { MultiTenancyController } from './multi-tenancy.controller';

@Module({
  controllers: [MultiTenancyController],
  providers: [MultiTenancyService],
})
export class MultiTenancyModule {}
