import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { config } from './config/app.config';

const { PORT } = config;

async function start() {
  const logger = new Logger('SERVER');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(PORT, () => logger.log(`Blog app successfully started on port ${PORT}`));
}
start();
