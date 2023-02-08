import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { MinioService } from 'nestjs-minio-client';
import { join } from 'path';
import { Equal, Repository } from 'typeorm';
import { Media } from '../../entities/media.entity';
import { User } from '../../entities/user.entity';
import { config } from 'src/config/app.config';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private minIO: MinioService,
  ) {}
  async updateProfileImage(file: Express.Multer.File, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['avatar'] });
    const mediaToDelete = user.avatar;

    if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

    if (mediaToDelete) {
      await this.minIO.client.removeObject(config.MINIO_STATIC_BUCKET, mediaToDelete.id);
      await this.mediaRepository.remove(mediaToDelete);
    }

    const media = await this.saveStaticImage(file, user);
    console.log(media);
    await this.userRepository.update({ id: Equal(user.id) }, { avatar: media });

    return media;
  }

  async getImage(userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['avatar'] });
      const image = user?.avatar;

      if (!image) {
        const file = createReadStream(join(__dirname, '..', '..', 'assets', 'Default.png'));

        return file;
      }

      return await this.getStaticImage(image.id);
    } catch (err) {
      const file = createReadStream(join(__dirname, '..', '..', 'assets', 'Default.png'));

      return file;
    }
  }

  async getStaticImage(imageId: string) {
    // Todo add support for media entity being more of an image instead of just user profile.
    try {
      return await this.minIO.client.getObject(config.MINIO_STATIC_BUCKET, imageId);
    } catch (err) {
      if (err?.code === 'NotFound' || err?.code === 'NoSuchKey') {
        throw new NotFoundException();
      }

      throw err;
    }
  }

  async saveStaticImage(image: Express.Multer.File, user: User, id?: string) {
    // Todo add support for media entity being more of an image instead of just user profile.
    const newId = id ?? randomUUID();

    const newMedia = this.mediaRepository.create({
      uploader: user,
      originalName: image.originalname,
      bucketName: newId,
    });

    const saved = await (await this.mediaRepository.insert(newMedia)).raw[0];

    await this.minIO.client.putObject(config.MINIO_STATIC_BUCKET, saved.id, image.buffer);

    return saved;
  }
}
