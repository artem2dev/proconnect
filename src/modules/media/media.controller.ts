import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IExtendedRequestWithUser } from 'src/common/types/interfaces';
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
}
