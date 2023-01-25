import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UserBody } from 'src/common/decorators/user.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { User } from 'src/entities/user.entity';
import { ArticleService } from './article.service';
import { ArticleDto } from './dto/article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('all')
  async getAllArticles() {
    return this.articleService.findAll();
  }

  @Get(':id')
  async getArticle(@Param('id') id: string) {
    return await this.articleService.findOne(id);
  }
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createArticle(@Body() dto: ArticleDto, @UserBody() user: User, @UploadedFile('image') image) {
    return await this.articleService.createArticle(user, dto, image);
  }

  @Put(':id')
  async updateArticle(@Param('id') id: string, @Body() dto: UpdateArticleDto, @UserBody() user: User) {
    return await this.articleService.updateArticle(id, user, dto);
  }

  @Delete(':id')
  async deleteArticle(@Param('id') id: string, @UserBody() user: User) {
    console.log(id, user);
    return await this.articleService.deleteArticle(user, id);
  }
}
