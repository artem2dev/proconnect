import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ArticleCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;
}
