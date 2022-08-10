import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cloneBuffer from 'clone-buffer';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(
    cors({
      // origin: ['https://fishmyspot.com', 'https://stripe.com'],
    }),
  );
  app.use(cookieParser());
  app.use(
    json({
      verify: (req: any, res, buf, encoding) => {
        // important to store rawBody for Stripe signature verification
        if (req.headers['stripe-signature'] && Buffer.isBuffer(buf)) {
          req.rawBody = cloneBuffer(buf);
        }
        return true;
      },
    }),
  );

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

  await app
    .listen(port)
    .then(() => console.log(`Server listening in port ${port}`));
}

bootstrap();
