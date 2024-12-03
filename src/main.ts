import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  NestApplicationOptions,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as packageJson from '../package.json';

async function bootstrap() {
  const appOptions: NestApplicationOptions = {
    logger: ['error', 'warn', 'debug', 'log'],
  };

  const app = await NestFactory.create(AppModule, appOptions);

  // Enable CORS
  const corsOptions = {};
  app.enableCors(corsOptions);

  // Set up global interceptors
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Set global prefix and versioning
  const globalApiPrefix = '/api';
  app.setGlobalPrefix(globalApiPrefix);
  app.enableVersioning();

  // Get ConfigService to load environment variables
  const config: ConfigService = app.get(ConfigService);

  // Fetch required configuration values
  const port: number = config.getOrThrow<number>('APP_PORT');
  const clientId: string = config.getOrThrow<string>('OPENAPI_CLIENT_ID');
  const clientSecret: string = config.getOrThrow<string>(
    'OPENAPI_CLIENT_SECRET',
  );
  const authority: string = config.getOrThrow<string>('IDP_AUTHORITY');

  // Define scopes and redirect URI
  const scopes: string[] = ['openid', 'profile', 'email', 'offline_access'];
  let redirectUri: string;

  // Set up Swagger documentation
  const swaggerDocument = new DocumentBuilder()
    .setTitle('AS-BUILT API')
    .setDescription('The AS-BUILT API description')
    .setVersion(packageJson.version)
    .setTermsOfService('http://swagger.io/terms/')
    .setExternalDoc('Find out more about Swagger', 'http://swagger.io/')
    .setContact('Developer', '', 'mail@example.com')
    .setLicense('Apache 2.0', 'http://www.apache.org/licenses/LICENSE-2.0.html')
    .addSecurity('zitadel-jwt', {
      type: 'openIdConnect',
      openIdConnectUrl: `${authority}/.well-known/openid-configuration`,
      name: 'Zitadel',
    });

  // Set environment-specific configurations
  if (config.get<string>('NODE_ENV') !== 'production') {
    swaggerDocument.addServer(`http://localhost:${port}`);
    redirectUri = `http://localhost:${port}`;
  } else {
    const prodUrl = config.get<string>(
      'PROD_URL',
      'https://your-production-domain.com',
    ); // Default value added for safety
    redirectUri = prodUrl;
    swaggerDocument.addServer(prodUrl);
  }

  // Generate Swagger document
  const document = SwaggerModule.createDocument(app, swaggerDocument.build());
  SwaggerModule.setup(globalApiPrefix.slice(1), app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: `${redirectUri}${globalApiPrefix}/oauth2-redirect.html`,
      initOAuth: {
        clientId,
        clientSecret,
        scopes,
      },
    },
  });

  // Start the application
  await app.listen(port);
}

bootstrap().then();
