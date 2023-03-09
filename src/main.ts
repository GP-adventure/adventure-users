import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import {
  ClassSerializerInterceptor,
  INestMicroservice,
  ValidationPipe,
} from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:3001',
      package: 'auth',
      protoPath: 'node_modules/adventure-proto/proto/auth.proto',
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // app.use(cookieParser());
  await app.listen();
}

bootstrap();
