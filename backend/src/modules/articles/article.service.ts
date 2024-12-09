import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExceptionDictionary } from '../../common/dictionary/ExceptionDictionary';
import { ArticleComment } from '../../entities/article-comment.entity';
import { Article } from '../../entities/article.entity';
import { User } from '../../entities/user.entity';
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
    console.info('Add article by user : ', user.id, dto);
    const article = this.articleRepository.create({ ...dto, author: user });

    if (image) {
      article.media = await this.mediaService.saveStaticImage(image, user);
    }

    const savedArticle = await this.articleRepository.save(article);

    savedArticle.omit('author');

    const processedArticle = {
      ...savedArticle,
      likedByUser: false,
      likesCount: 0,
      commentsCount: 0,
    };

    return processedArticle;
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
      .orderBy('a.createdAt', 'DESC')
      .addOrderBy('comment.createdAt')
      .getMany();

    const processedArticle = foundArticles.map((article: any) => {
      article.likedByUser = Boolean(article?.likes?.find((u) => u.id === user.id));
      article.likesCount = article.likes?.length;
      article.commentsCount = article.comments?.length;

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

    if (!foundArticle) {
      throw new NotFoundException(ExceptionDictionary.articles.notFound);
    }

    const processedArticle = {
      ...foundArticle,
      likedByUser: Boolean(foundArticle?.likes?.find((u) => u.id === user.id)),
      likesCount: foundArticle.likes.length,
      commentsCount: foundArticle.comments.length,
    };

    return processedArticle;
  }

  async getUserArticlesCount(userId: string) {
    return await this.articleRepository
      .createQueryBuilder('a')
      .select()
      .where('a.authorId = :userId', { userId })
      .getCount();
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

    await foundArticle.update({ ...dto });

    return await this.findOne(user, id);
  }

  async likeArticle(user: User, id: string) {
    const foundArticle = await this.articleRepository
      .createQueryBuilder('a')
      .select()
      .where('a.id = :id', { id })
      .leftJoinAndSelect('a.likes', 'likes')
      .leftJoinAndSelect('a.comments', 'comment')
      .getOne();

    foundArticle.likes = [...foundArticle.likes, user];

    await foundArticle.save();

    const processedArticle = {
      ...foundArticle,
      likedByUser: Boolean(foundArticle?.likes?.find((u) => u.id === user.id)),
      likesCount: foundArticle.likes.length,
      commentsCount: foundArticle.comments.length,
    };

    return processedArticle;
  }

  async dislikeArticle(user: User, id: string) {
    const foundArticle = await this.articleRepository
      .createQueryBuilder('a')
      .select()
      .where('a.id = :id', { id })
      .leftJoinAndSelect('a.likes', 'likes')
      .leftJoinAndSelect('a.comments', 'comment')
      .getOne();

    foundArticle.likes = foundArticle.likes.filter((u) => {
      return u.id !== user.id;
    });

    await foundArticle.save();

    const processedArticle = {
      ...foundArticle,
      likedByUser: Boolean(foundArticle?.likes?.find((u) => u.id === user.id)),
      likesCount: foundArticle.likes.length,
      commentsCount: foundArticle.comments.length,
    };

    return processedArticle;
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
