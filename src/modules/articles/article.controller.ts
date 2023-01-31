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
import { ArticleDto } from './dto/article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags('Articles')
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

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createArticle(
    @Body() dto: ArticleDto,
    @UserBody() user: User,
    @UploadedFile() image: Express.Multer.File,
    @Req() r: Request,
  ) {
    console.log(111, image);
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
    console.log(id, user);
    return await this.articleService.deleteArticle(user, id);
  }
}
