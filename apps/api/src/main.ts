import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import type { Express, Request, RequestHandler, Response } from 'express';
import { env } from './env';
import { AppModule } from './app.module';

const swaggerSpecPath = join(process.cwd(), 'swagger-spec.json');

function operationIdFactory(controllerKey: string, methodKey: string): string {
  const withoutController = controllerKey.replace(/Controller$/i, '');
  const camelBase = withoutController.charAt(0).toLowerCase() + withoutController.slice(1);
  const pascalMethod = methodKey.charAt(0).toUpperCase() + methodKey.slice(1);
  return `${camelBase}${pascalMethod}`;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const expressApp: Express = app.getHttpAdapter().getInstance();
  const securityHeadersMiddleware: RequestHandler = (_request, response, next) => {
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');

    if (env.NODE_ENV === 'production') {
      response.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
      );
      response.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload',
      );
    }

    next();
  };

  expressApp.set('trust proxy', env.TRUST_PROXY);

  app.use(cookieParser());
  app.use(securityHeadersMiddleware);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: env.CORS_ALLOWED_ORIGINS,
    credentials: true,
  });

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Starter API')
      .setDescription('Backend API for the starter template')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Short-lived JWT (login or POST /auth/refresh)',
        },
        'access-token',
      )
      .build(),
    { operationIdFactory },
  );

  if (env.NODE_ENV !== 'production') {
    SwaggerModule.setup('/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    expressApp.get('/api-json', (_request: Request, response: Response) => {
      response.json(document);
    });

    writeFileSync(swaggerSpecPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
    Logger.log(`Swagger spec written to ${swaggerSpecPath}`, 'Bootstrap');
  }

  await app.listen(env.PORT);
}

void bootstrap();
