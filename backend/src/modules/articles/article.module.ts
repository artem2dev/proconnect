import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { ArticleController } from './article.controller';
import { Article } from '../../entities/article.entity';
import { ArticleService } from './article.service';
import { MediaModule } from '../media/media.module';
import { ArticleComment } from '../../entities/article-comment.entity';

@Module({
  imports: [MediaModule, TypeOrmModule.forFeature([Article, User, ArticleComment])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
