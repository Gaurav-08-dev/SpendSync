/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { ApiKeyAuthGuard } from './auth/guard/apiKey-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * Security
  app.useGlobalGuards(new ApiKeyAuthGuard());
  app.enableCors();
  app.use(helmet());


  app.enableVersioning({ type: VersioningType.URI });


  //*  Setup OpenAPI swagger config
  const config = new DocumentBuilder()
    .setTitle('SpendSync API')
    .setDescription('APIs to manage your data stressfree using LLMs')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
      },
      'apiKey',
    )
    .addTag('spend-sync')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // * Setup config ends

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
