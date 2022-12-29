import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';
import { Article } from './articles/article.entity';
import { ArticleModule } from './articles/article.module';
import { FriendRequest } from './modules/friends/friend-requests.entity';
import { AuthModule } from './auth/auth.module';
import { Media } from './media/media.entity';
import { MediaModule } from './media/media.module';
import { User } from './users/user.entity';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ArticleModule,
    UserModule,
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Article, Media, FriendRequest],
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
    }),
    MinioModule.register({
      endPoint: '127.0.0.1',
      port: 9099,
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
      isGlobal: true,
    }),
    MulterModule.register({ dest: '/temp' }),
    AuthModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
