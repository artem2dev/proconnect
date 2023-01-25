import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserBody } from 'src/common/decorators/user.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IExtendedRequestWithUser, IId, IUserIdAndEmail } from 'src/common/types/interfaces';
import { User } from 'src/entities/user.entity';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(AccessTokenGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  updateProfileImage(@UploadedFile() file: Express.Multer.File, @Request() req: IExtendedRequestWithUser) {
    return this.mediaService.updateProfileImage(file, req.user);
  }

  @Get('image/:userId')
  async getProfileImage(@Param('userId') userId: string, @Response() res: any) {
    const imageStream = await this.mediaService.getImage({
      id: userId,
    });

    res.attachment(userId);

    imageStream.pipe(res);
  }

  @Get('static/image/:imageId')
  async getStaticImage(@Param('imageId') imageId: string, @Response() res: any) {
    const imageStream = await this.mediaService.getStaticImage(imageId);

    imageStream?.pipe(res);
  }
  @UseGuards(AccessTokenGuard)
  @Get('static/image')
  async saveStaticImage(@UserBody() user: User, @UploadedFile('image') image: Express.Multer.File) {
    return await this.mediaService.saveStaticImage(image.buffer);
  }
}
