import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleComment } from '../../entities/article-comment.entity';
import { Article } from '../../entities/article.entity';
import { User } from '../../entities/user.entity';
import { MediaModule } from '../media/media.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [MediaModule, TypeOrmModule.forFeature([Article, User, ArticleComment])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
