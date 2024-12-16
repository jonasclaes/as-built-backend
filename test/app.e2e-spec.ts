import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as process from 'node:process';
import { TestEnvironmentGlobals } from './testEnvironment';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

const globals = global as typeof globalThis & TestEnvironmentGlobals;

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.OPENAPI_CLIENT_ID =
      process.env.OPENAPI_CLIENT_ID || 'default-client-id';
    process.env.OPENAPI_CLIENT_SECRET =
      process.env.OPENAPI_CLIENT_SECRET || 'default-client-secret';
    process.env.IDP_AUTHORITY =
      process.env.IDP_AUTHORITY || 'http://default-idp-authority';
    process.env.IDP_AUTHORIZATION_PROFILE_KEY_ID =
      process.env.IDP_AUTHORIZATION_PROFILE_KEY_ID || 'default-key-id';
    process.env.IDP_AUTHORIZATION_PROFILE_KEY =
      process.env.IDP_AUTHORIZATION_PROFILE_KEY || 'default-key';
    process.env.IDP_AUTHORIZATION_PROFILE_APP_ID =
      process.env.IDP_AUTHORIZATION_PROFILE_APP_ID || 'default-app-id';
    process.env.IDP_AUTHORIZATION_PROFILE_CLIENT_ID =
      process.env.IDP_AUTHORIZATION_PROFILE_CLIENT_ID || 'default-client-id';

    process.env.DATABASE_URL = globals.postgresContainer.getConnectionUri();
    process.env.STORAGE_ENDPOINT_URL =
      globals.minioContainer.getConnectionUri();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) => {
          const config = {
            OPENAPI_CLIENT_ID: 'test-client-id',
            OPENAPI_CLIENT_SECRET: 'test-client-secret',
            IDP_AUTHORITY: 'http://test-idp-authority',
            IDP_AUTHORIZATION_PROFILE_KEY_ID: 'test-key-id',
            IDP_AUTHORIZATION_PROFILE_KEY: 'test-key',
            IDP_AUTHORIZATION_PROFILE_APP_ID: 'test-app-id',
            IDP_AUTHORIZATION_PROFILE_CLIENT_ID: 'test-client-id',
            DATABASE_URL: globals.postgresContainer.getConnectionUri(),
            STORAGE_ENDPOINT_URL: globals.minioContainer.getConnectionUri(),
          };
          return config[key];
        },
      })
      .overrideGuard(AuthGuard('zitadel'))
      .useValue({ canActivate: () => true })
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
