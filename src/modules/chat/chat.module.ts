import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UserModule } from '../users/user.module';
import { ChatController } from './chat.controller';
import { Message } from './message.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User]), UserModule],
  providers: [ChatService, ChatGateway, JwtService],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
