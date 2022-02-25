import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') ?? 3000;

  const config = new DocumentBuilder()
    .setTitle('FISH MY SPOT API')
    .setDescription('FISH MY SPOT API CENTRAL')
    .setVersion('1.0')
    .addTag('fish')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = {};

        errors.forEach((obj) => {
          messages[obj.property] =
            obj.constraints[Object.keys(obj.constraints)[0]];
        });

        throw new UnprocessableEntityException({
          messages,
          statusCode: 422,
        });
      },
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(cors());

  await app
    .listen(port)
    .then(() => console.log(`Server listening in port ${port}`));
}

bootstrap();
