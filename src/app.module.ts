import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './articles/article.entity';
import { ArticleModule } from './articles/article.module';
import { User } from './users/user.entity';
import { UserModule } from './users/user.module';
import { secret } from './utils/constants';

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
      entities: [User, Article],
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
    }),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
