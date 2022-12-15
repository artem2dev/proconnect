import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function start() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () =>
    console.log('Blog app successfully started on port', PORT),
  );
}
start();
