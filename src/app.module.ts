import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { TenancyModule } from './tenancy/tenancy.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { TenantsModule } from './tenants/tenants.module';
import { ormConfig } from './typeorm/orm.config';
import { MultiTenancyModule } from './multi-tenancy/multi-tenancy.module';
import { RevisionsController } from './revisions/revisions.controller';
import { RevisionsModule } from './revisions/revisions.module';
import { RevisionsService } from './revisions/revisions.service';
import { RevisionsController } from './revisions/revisions.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...ormConfig,
        url: configService.get('DATABASE_URL'),
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ClientsModule,
    TenancyModule,
    ProjectsModule,
    TenantsModule,
    MultiTenancyModule,
    RevisionsModule,
  ],
  controllers: [AppController, RevisionsController],
  providers: [AppService, RevisionsService],
})
export class AppModule {}
