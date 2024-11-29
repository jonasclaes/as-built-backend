import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as process from 'node:process';
import { TestEnvironmentGlobals } from './testEnvironment';
import { AuthGuard } from '@nestjs/passport';

const globals = global as typeof globalThis & TestEnvironmentGlobals;

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(() => {
    process.env.DATABASE_URL = globals.postgresContainer.getConnectionUri();
    process.env.STORAGE_ENDPOINT_URL =
      globals.minioContainer.getConnectionUri();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('zitadel'))
      .useValue({
        canActivate: () => true,
      })
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
