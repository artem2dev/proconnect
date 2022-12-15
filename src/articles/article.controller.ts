import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('all')
  async getAllArticles() {
    return await this.articleService.findAll();
  }

  @Get(':id')
  async getArticle(@Param('id') id: string) {
    return await this.articleService.findOne(id);
  }

  @Post()
  async createArticle(@Body() dto: CreateArticleDto) {
    return await this.articleService.createArticle(dto);
  }

  @Put(':id')
  async updateArticle() {}

  @Delete(':id')
  async deleteArticle(@Param('id') id: number) {
    return await this.articleService.deleteUser(id);
  }
}
