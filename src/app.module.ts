import { DynamicModule, Module } from '@nestjs/common';
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

@Module({})
export class AppModule {
  static register(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: Joi.object({
            NODE_ENV: Joi.string()
              .valid('development', 'production', 'test', 'provision')
              .default('production'),
            OPENAPI_CLIENT_ID: Joi.string().required(),
            OPENAPI_CLIENT_SECRET: Joi.string().required(),
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
            DATABASE_URL: Joi.string().required(),
          }),
          validationOptions: {
            abortEarly: false,
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
          useFactory: (
            configService: ConfigService,
          ): ZitadelAuthModuleConfig => {
            return {
              authority: configService.getOrThrow<string>('IDP_AUTHORITY'),
              authorization: {
                type: configService.getOrThrow<'jwt-profile'>(
                  'IDP_AUTHORIZATION_TYPE',
                ),
                profile: {
                  type: configService.getOrThrow<'application'>(
                    'IDP_AUTHORIZATION_PROFILE_TYPE',
                  ),
                  keyId: configService.getOrThrow<string>(
                    'IDP_AUTHORIZATION_PROFILE_KEY_ID',
                  ),
                  key: configService.getOrThrow<string>(
                    'IDP_AUTHORIZATION_PROFILE_KEY',
                  ),
                  appId: configService.getOrThrow<string>(
                    'IDP_AUTHORIZATION_PROFILE_APP_ID',
                  ),
                  clientId: configService.getOrThrow<string>(
                    'IDP_AUTHORIZATION_PROFILE_CLIENT_ID',
                  ),
                },
              },
            };
          },
          inject: [ConfigService],
        }),

export class AppModule {}
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
    };
  }
}

