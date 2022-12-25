import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MinioService } from 'nestjs-minio-client';
import { IGetUser, IGetUserInfo } from 'src/common/types/user';
import { UserService } from 'src/users/user.service';
import { Repository } from 'typeorm';
import { Media } from './media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private minIO: MinioService,
    private userService: UserService,
  ) {}
  async updateProfileImage(file: Express.Multer.File, userInfo: IGetUserInfo) {
    const { id: userId } = userInfo;
    const user = await this.userService.findOne(userId);

    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    const media = await this.mediaRepository.save({
      user: userInfo,
      originalName: file.originalname,
      createdAt: new Date(Date.now()),
    });

    await this.minIO.client.putObject('media', media.id, file.buffer);

    return media;
  }

  async getImage(user: IGetUser) {
    const image = await this.mediaRepository.findOneBy({ user });

    const imageData = this.minIO.client.getObject(
      'media',
      image.id,
      (err, stream) => {
        return stream;
      },
    );

    return imageData;
  }
}
