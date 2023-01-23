import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { SendMessageDto } from './dto/send.message.dto';
import { Message } from '../../entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private chatRepository: Repository<Message>,
    private userService: UserService,
  ) {}

  async createMessage(message: SendMessageDto) {
    await this.chatRepository.save({ ...message });
  }

  async getMessages(authorId: string, recipientId: string) {
    const messages = await this.chatRepository
      .createQueryBuilder('msg')
      .select()
      .leftJoinAndSelect('msg.author', 'author')
      .leftJoinAndSelect('msg.recipient', 'recipient')
      .where(
        '(msg.author = :authorId AND msg.recipient = :recipientId) OR (msg.author = :recipientId AND msg.recipient = :authorId)',
        { authorId, recipientId },
      )
      .getMany();

    return messages;
  }

  async getListOfRecipientsWithLastMessage(authorId: string, recipientUserName: string) {
    const recipient = await this.userService.getUserByUserName(recipientUserName);

    const messages = await this.chatRepository
      .createQueryBuilder('msg')
      .select()
      .leftJoinAndSelect('msg.author', 'author')
      .leftJoinAndSelect('msg.recipient', 'recipient')
      .where(
        '(msg.author = :authorId AND msg.recipient = :recipient) OR (msg.author = :recipient AND msg.recipient = :authorId)',
        { authorId, recipient: recipient.id },
      )
      .getMany();

    return messages;
  }
}
