import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { ExceptionDictionary } from 'src/common/dictionary/ExceptionDictionary';
import { ArticleComment } from 'src/entities/article-comment.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Article } from '../../entities/article.entity';
import { MediaService } from '../media/media.service';
import { ArticleCommentDto } from './dto/article.comment.dto';
import { ArticleDto } from './dto/article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(ArticleComment)
    private articleCommentRepository: Repository<ArticleComment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mediaService: MediaService,
  ) {}

  async createArticle(user: User, dto: ArticleDto, image: Express.Multer.File) {
    const article = this.articleRepository.create({ ...dto, author: user });

    if (image) {
      article.media = await this.mediaService.saveStaticImage(image, user);
    }

    const savedArticle = await this.articleRepository.save(article);

    savedArticle.omit('author');

    return savedArticle;
  }

  async findAll(user: User) {
    const foundArticles = await this.articleRepository
      .createQueryBuilder('a')
      .select()
      .leftJoinAndSelect('a.media', 'media')
      .leftJoinAndSelect('a.author', 'author')
      .leftJoinAndSelect('a.likes', 'likes')
      .leftJoinAndSelect('a.comments', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .orderBy('a.createdAt')
      .addOrderBy('comment.createdAt')
      .getMany();

    const processedArticle = foundArticles.map((article: any) => {
      article.likedByUser = Boolean(article?.likes?.find((u) => u.id === user.id));
      article.likes = article.likes.length;

      return article;
    });

    return processedArticle;
  }

  async findOne(user: User, id: string) {
    const foundArticle = await this.articleRepository
      .createQueryBuilder('a')
      .select()
      .where('a.id = :id', { id })
      .leftJoinAndSelect('a.media', 'media')
      .leftJoinAndSelect('a.author', 'author')
      .leftJoinAndSelect('a.likes', 'likes')
      .leftJoinAndSelect('a.comments', 'comment')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .orderBy('a.createdAt')
      .addOrderBy('comment.createdAt')
      .getOne();

    // foundArticle.omit(['author.email', 'author.description']);

    if (!foundArticle) {
      throw new NotFoundException(ExceptionDictionary.articles.notFound);
    }

    const processedArticle = {
      ...foundArticle,
      likedByUser: Boolean(foundArticle?.likes?.find((u) => u.id === user.id)),
      likes: foundArticle.likes.length,
    };

    return processedArticle;
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

  async likeArticle(user: User, id: string) {
    const foundArticle = await this.articleRepository
      .createQueryBuilder('a')
      .select()
      .where('a.id = :id', { id })
      .leftJoinAndSelect('a.likes', 'likes')
      .getOne();

    foundArticle.likes = [...foundArticle.likes, user];

    foundArticle.save();
  }

  async dislikeArticle(user: User, id: string) {
    const foundArticle = await this.articleRepository
      .createQueryBuilder('a')
      .select()
      .where('a.id = :id', { id })
      .leftJoinAndSelect('a.likes', 'likes')
      .getOne();

    foundArticle.likes = foundArticle.likes.filter((u) => {
      console.log(u, u.id !== user.id);
      return u.id !== user.id;
    });

    foundArticle.save();
  }

  async commentArticle(user: User, articleId: string, dto: ArticleCommentDto) {
    const foundArticle = await this.articleRepository.findOneBy({ id: articleId });

    if (!foundArticle) {
      throw new NotFoundException();
    }

    const foundUser = await this.userRepository.findOneBy({ id: user.id });

    const savedComment = await this.articleCommentRepository
      .create({ author: user, comment: dto.comment, articleId })
      .save();

    return { ...savedComment, author: foundUser };
  }

  async deleteCommentArticle(user: User, commentId: string) {
    const foundComment = await this.articleCommentRepository.findOneBy({ id: commentId, authorId: user.id });

    if (!foundComment) {
      throw new NotFoundException();
    }

    await foundComment.remove();
  }
}
