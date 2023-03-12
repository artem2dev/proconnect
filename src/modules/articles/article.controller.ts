import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserBody } from 'src/common/decorators/user.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { User } from 'src/entities/user.entity';
import { ArticleService } from './article.service';
import { ArticleCommentDto } from './dto/article.comment.dto';
import { ArticleDto } from './dto/article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
@UseGuards(AccessTokenGuard)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiBearerAuth()
  @Get('all')
  async getAllArticles(@UserBody() user: User) {
    return this.articleService.findAll(user);
  }

  @Get(':id')
  async getArticle(@Param('id') id: string, @UserBody() user: User) {
    return await this.articleService.findOne(user, id);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createArticle(@Body() dto: ArticleDto, @UserBody() user: User, @UploadedFile() image: Express.Multer.File) {
    return await this.articleService.createArticle(user, dto, image);
  }

  @ApiBearerAuth()
  @Put(':id')
  async updateArticle(@Param('id') id: string, @Body() dto: UpdateArticleDto, @UserBody() user: User) {
    return await this.articleService.updateArticle(id, user, dto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteArticle(@Param('id') id: string, @UserBody() user: User) {
    return await this.articleService.deleteArticle(user, id);
  }

  @ApiBearerAuth()
  @Post('like/:id')
  async likeArticle(@Param('id') id: string, @UserBody() user: User) {
    return await this.articleService.likeArticle(user, id);
  }

  @ApiBearerAuth()
  @Post('dislike/:id')
  async dislikeArticle(@Param('id') id: string, @UserBody() user: User) {
    return await this.articleService.dislikeArticle(user, id);
  }

  @ApiBearerAuth()
  @Post('comment/:id')
  async commentArticle(@Param('id') articleId: string, @UserBody() user: User, @Body() dto: ArticleCommentDto) {
    return await this.articleService.commentArticle(user, articleId, dto);
  }

  @ApiBearerAuth()
  @Delete('comment/:id')
  async deleteCommentArticle(@Param('id') commentId: string, @UserBody() user: User) {
    return await this.articleService.deleteCommentArticle(user, commentId);
  }
}
