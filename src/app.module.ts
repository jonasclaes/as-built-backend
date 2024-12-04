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
import { FilesModule } from './files/files.module';
import { StorageModule } from './storage/storage.module';
import * as Joi from 'joi';
import { ZitadelAuthModule } from './zitadel-auth/zitadel-auth.module';
import { ZitadelAuthModuleConfig } from './zitadel-auth/interfaces/zitadel-auth-module-config.interface';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('production'),
        OPENAPI_CLIENT_ID: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        OPENAPI_CLIENT_SECRET: Joi.string().when('NODE_ENV', {
          is: 'production',
          then: Joi.optional(),
          otherwise: Joi.required(),
        }),
        IDP_AUTHORITY: Joi.string().required(),
        IDP_AUTHORIZATION_TYPE: Joi.string()
          .valid('jwt-profile')
          .default('jwt-profile')
          .optional(),
        IDP_AUTHORIZATION_PROFILE_TYPE: Joi.string()
          .valid('application')
          .default('application')
          .optional(),
        IDP_AUTHORIZATION_PROFILE_KEY_ID: Joi.string().required(),
        IDP_AUTHORIZATION_PROFILE_KEY: Joi.string().required(),
        IDP_AUTHORIZATION_PROFILE_APP_ID: Joi.string().required(),
        IDP_AUTHORIZATION_PROFILE_CLIENT_ID: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),

    // Database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...ormConfig,
        url: configService.get<string>('DATABASE_URL'),
        synchronize: false,
      }),
      inject: [ConfigService],
    }),

    ZitadelAuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): ZitadelAuthModuleConfig => ({
        authority: config.getOrThrow<string>('IDP_AUTHORITY'),
        authorization: {
          type: config.getOrThrow<'jwt-profile'>('IDP_AUTHORIZATION_TYPE'),
          profile: {
            type: config.getOrThrow<'application'>(
              'IDP_AUTHORIZATION_PROFILE_TYPE',
            ),
            keyId: config.getOrThrow<string>(
              'IDP_AUTHORIZATION_PROFILE_KEY_ID',
            ),
            key: config.getOrThrow<string>('IDP_AUTHORIZATION_PROFILE_KEY'),
            appId: config.getOrThrow<string>(
              'IDP_AUTHORIZATION_PROFILE_APP_ID',
            ),
            clientId: config.getOrThrow<string>(
              'IDP_AUTHORIZATION_PROFILE_CLIENT_ID',
            ),
          },
        },
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
    FilesModule,
    StorageModule,
    UsersModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
