import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Article } from '../../entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createArticle(dto: CreateArticleDto) {
    const user = await this.userRepository.findOneBy({ id: dto.author });
    if (!user) throw new Error('User not exist');

    const article = this.articleRepository.create({ ...dto, author: user });

    const { raw: res } = await this.articleRepository.insert(article);

    return res[0];
  }

  findAll() {
    return this.articleRepository.find();
  }

  findOne(id: string) {
    return this.articleRepository.findOneBy({ id });
  }

  async deleteUser(id: number) {
    await this.articleRepository.delete(id);
  }
}
