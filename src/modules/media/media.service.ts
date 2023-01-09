import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { MinioService } from 'nestjs-minio-client';
import { join } from 'path';
import { IGetUser, IGetUserInfo } from 'src/common/types/user';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Media } from './media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    private minIO: MinioService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async updateProfileImage(file: Express.Multer.File, userInfo: IGetUserInfo) {
    const { id: userId } = userInfo;
    const user: any = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    const mediaToDelete = await this.mediaRepository.findOneBy({ user });

    if (mediaToDelete) {
      await this.minIO.client.removeObject('media', mediaToDelete.id);
      await this.mediaRepository.remove(mediaToDelete);
    }

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
    console.log(image)
    if (!image) {
      const file = createReadStream(join(__dirname, '..', '..', 'assets', 'Default.png'));

      return file;
    }

    return await this.minIO.client.getObject('media', image.id);
  }
}
