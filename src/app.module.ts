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
import { RevisionsModule } from './revisions/revisions.module';
import { CommentsModule } from './comments/comments.module';

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
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
