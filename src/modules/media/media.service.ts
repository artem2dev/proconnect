import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream } from 'fs';
import { MinioService } from 'nestjs-minio-client';
import { join } from 'path';
import { IId, IUserIdAndEmail } from 'src/common/types/interfaces';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Media } from '../../entities/media.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private minIO: MinioService,
  ) {}
  // async updateProfileImage(file: Express.Multer.File, userInfo: IUserIdAndEmail) {
  //   const { id: userId } = userInfo;
  //   const user: any = await this.userRepository.findOneBy({ id: userId });

  //   if (!user) throw new HttpException('No such user', HttpStatus.BAD_REQUEST);

  //   const mediaToDelete = await this.mediaRepository.findOneBy({ user });

  //   if (mediaToDelete) {
  //     await this.minIO.client.removeObject('media', mediaToDelete.id);
  //     await this.mediaRepository.remove(mediaToDelete);
  //   }

  //   const media = await this.mediaRepository.save({
  //     user: userInfo,
  //     originalName: file.originalname,
  //     createdAt: new Date(Date.now()),
  //   });

  //   await this.minIO.client.putObject('media', media.id, file.buffer);

  //   return media;
  // }

  // async getImage(user: IId) {
  //   try {
  //     const image = await this.mediaRepository.findOneBy({ user });

  //     if (!image) {
  //       const file = createReadStream(join(__dirname, '..', '..', 'assets', 'Default.png'));

  //       return file;
  //     }

  //     return await this.minIO.client.getObject('media', image.id);
  //   } catch (err) {
  //     const file = createReadStream(join(__dirname, '..', '..', 'assets', 'Default.png'));

  //     return file;
  //   }
  // }

  async getStaticImage(imageId: string) {
    // Todo add support for media entity being more of an image instead of just user profile.
    try {
      return await this.minIO.client.getObject('static', imageId);
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

    await this.minIO.client.putObject('static', newId, image.buffer);

    const newMedia = await this.mediaRepository.create({
      uploader: user,
      originalName: image.originalname,
      bucketName: newId,
    });
    const saved = await (await this.mediaRepository.insert(newMedia)).raw[0];
    console.log(saved);
    return saved;
  }
}
