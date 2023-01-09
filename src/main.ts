import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function start() {
  const logger = new Logger('SERVER');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => logger.log(`Blog app successfully started on port ${PORT}`));
}
start();
