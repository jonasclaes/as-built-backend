import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as process from 'node:process';
import { AuthGuard } from '@nestjs/passport';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { MinIOContainer, StartedMinIOContainer } from './minioContainer';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let postgresContainer: StartedPostgreSqlContainer;
  let minioContainer: StartedMinIOContainer;

  beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer().start();
    minioContainer = await new MinIOContainer().start();

    process.env.NODE_ENV = 'test';
    process.env.APP_PORT = '3000';

    process.env.OPENAPI_CLIENT_ID = 'test-client-id';
    process.env.OPENAPI_CLIENT_SECRET = 'test-client-secret';
    process.env.IDP_AUTHORITY = 'http://test-idp-authority';
    process.env.IDP_AUTHORIZATION_TYPE = 'jwt-profile';
    process.env.IDP_AUTHORIZATION_PROFILE_TYPE = 'application';
    process.env.IDP_AUTHORIZATION_PROFILE_KEY_ID = 'test-key-id';
    process.env.IDP_AUTHORIZATION_PROFILE_KEY = 'test-key';
    process.env.IDP_AUTHORIZATION_PROFILE_APP_ID = 'test-app-id';
    process.env.IDP_AUTHORIZATION_PROFILE_CLIENT_ID = 'test-client-id';

    process.env.DATABASE_URL = postgresContainer.getConnectionUri();
    process.env.STORAGE_ENDPOINT_URL = minioContainer.getConnectionUri();
  }, 240_000);

  afterAll(async () => {
    await minioContainer.stop();
    await postgresContainer.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule.register()],
    })
      .overrideGuard(AuthGuard('zitadel'))
      .useValue({ canActivate: () => true })
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
