import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { config } from './app.config';

import { ArticleComment } from 'src/entities/article-comment.entity';
import { Article } from 'src/entities/article.entity';
import { FriendRequest } from 'src/entities/friend-requests.entity';
import { Media } from 'src/entities/media.entity';
import { Message } from 'src/entities/message.entity';
import { Room } from 'src/entities/room.entity';
import { SingleChat } from 'src/entities/single-chat.entity';
import { UserFriends } from 'src/entities/user-friends.entity';
import { User } from 'src/entities/user.entity';

const { DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, DB_HOST } = config;

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [User, Article, Media, FriendRequest, UserFriends, Message, ArticleComment, SingleChat, Room],
  synchronize: true,
  autoLoadEntities: true,
  logging: false,
};

export const OrmConfig = {
  ...typeOrmModuleOptions,
  migrationsTableName: 'migrations',
  migrations: ['dist/migrations/*.{js,ts}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default OrmConfig;
