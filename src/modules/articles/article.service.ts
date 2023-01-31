import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { ExceptionDictionary } from 'src/common/dictionary/ExceptionDictionary';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Article } from '../../entities/article.entity';
import { MediaService } from '../media/media.service';
import { ArticleDto } from './dto/article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private mediaService: MediaService,
  ) {}

  async createArticle(user: User, dto: ArticleDto, image: Express.Multer.File) {
    const article = this.articleRepository.create({ ...dto, author: user });
    console.log(image);
    if (image) {
      article.media = await this.mediaService.saveStaticImage(image, user);
    }

    const savedArticle = await this.articleRepository.save(article);

    savedArticle.omit('author');

    return savedArticle;
  }

  async findAll() {
    return this.articleRepository.find({ relations: ['author', 'media'] });
  }

  async findOne(id: string) {
    const foundArticle = await this.articleRepository.findOneBy({ id });

    if (!foundArticle) {
      throw new NotFoundException(ExceptionDictionary.articles.notFound);
    }

    return foundArticle;
  }

  async deleteArticle(user: User, id: string) {
    const foundArticle = await this.articleRepository.findOneBy({ id, authorId: user.id });

    foundArticle.remove();
  }

  async updateArticle(id: string, user: User, dto: UpdateArticleDto) {
    const foundArticle = await this.articleRepository.findOneBy({ id, authorId: user.id });

    if (!foundArticle) {
      throw new NotFoundException(ExceptionDictionary.articles.notFound);
    }

    return await foundArticle.update({ ...dto });
  }
}
