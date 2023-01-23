import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { MinioService } from 'nestjs-minio-client';
import { join } from 'path';
import { IId, IUserIdAndEmail } from 'src/common/types/interfaces';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Media } from '../../entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private minIO: MinioService,
  ) {}
  async updateProfileImage(file: Express.Multer.File, userInfo: IUserIdAndEmail) {
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

  async getImage(user: IId) {
    const image = await this.mediaRepository.findOneBy({ user });

    if (!image) {
      const file = createReadStream(join(__dirname, '..', '..', 'assets', 'Default.png'));

      return file;
    }

    return await this.minIO.client.getObject('media', image.id);
  }
}
