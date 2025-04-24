import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Foxtail Network API')
  .setDescription('Foxtail Network API')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Add in your Bearer auth token here:',
  })
  .addTag('Auth', 'JWT Authentication')
  .addTag('Users', 'User Module')
  .addTag('Media', 'Media Module')
  .addTag('Articles', 'Article Module')
  .addTag('Friends', 'Friends Module')
  .addTag('Chat', 'Chat Module')
  .setTermsOfService('TOS')
  .build();
