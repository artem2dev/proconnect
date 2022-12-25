import {
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IGetUserInfoRequest } from 'src/common/types/user';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(AccessTokenGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  updateProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: IGetUserInfoRequest,
  ) {
    return this.mediaService.updateProfileImage(file, req.user);
  }

  @UseGuards(AccessTokenGuard)
  @Get('image')
  getProfileImage(@Request() req: IGetUserInfoRequest) {
    return this.mediaService.getImage({
      id: req.user?.id,
    });
  }
}
