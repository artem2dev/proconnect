import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { MediaController } from './media.controller';
import { Media } from '../../entities/media.entity';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media, User])],
  controllers: [MediaController],
  providers: [MediaService, JwtService],
  exports: [MediaService],
})
export class MediaModule {}
