import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { env } from './env';
import { AppModule } from './app.module';

/** Matches lodash-style camelCase for simple PascalCase controller names (e.g. `Health` → `health`). */
function operationIdFactory(controllerKey: string, methodKey: string): string {
  const withoutController = controllerKey.replace(/Controller$/i, '');
  const camelBase = withoutController.charAt(0).toLowerCase() + withoutController.slice(1);
  const pascalMethod = methodKey.charAt(0).toUpperCase() + methodKey.slice(1);
  return `${camelBase}${pascalMethod}`;
}

const swaggerSpecPath = join(__dirname, '..', 'swagger-spec.json');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Starter API')
    .setDescription('Backend API for the starter template')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.getHttpAdapter().get('/api-json', (_req: Request, res: Response) => {
    res.json(document);
  });

  if (process.env.NODE_ENV !== 'production') {
    writeFileSync(swaggerSpecPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
    Logger.log(`Swagger spec written to ${swaggerSpecPath}`, 'Bootstrap');
  }

  await app.listen(env.PORT);
}

void bootstrap();
