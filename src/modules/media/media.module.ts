import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { MediaController } from './media.controller';
import { Media } from './media.entity';
import { MediaService } from './media.service';

@Module({
  imports: [forwardRef(() => UserModule), TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [MediaService, JwtService],
  exports: [MediaService],
})
export class MediaModule {}
