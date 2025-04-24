import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioModule } from 'nestjs-minio-client';
import MinioConfig from './config/minio.config';
import OrmConfig from './config/orm.config';
import { ArticleModule } from './modules/articles/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { CoreModule } from './modules/CoreModule/core.module';
import { FriendsModule } from './modules/friends/friends.module';
import { MediaModule } from './modules/media/media.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    CoreModule,
    ArticleModule,
    UserModule,
    AuthModule,
    MediaModule,
    FriendsModule,
    ChatModule,
    TypeOrmModule.forRoot(OrmConfig),
    MinioModule.register(MinioConfig),
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MulterModule.register({ dest: '/temp' }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
