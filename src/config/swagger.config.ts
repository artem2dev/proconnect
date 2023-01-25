import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Blog Api API')
  .setDescription('Blog API API')
  .setVersion('1.0')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Add in your Bearer auth token here:' },
    'access-token',
  )
  .addTag('Auth')
  .build();
