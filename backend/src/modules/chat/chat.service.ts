import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Message } from '../../entities/message.entity';
import { Room } from '../../entities/room.entity';
import { SingleChat } from '../../entities/single-chat.entity';
import { RoomType } from '../../enums/room.enum';
import { Equal, Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { CreateMessageDto } from './dto/create.message.dto';
import { ReadChatDto } from './dto/read.chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(SingleChat)
    private singleChatRepository: Repository<SingleChat>,
    private userService: UserService,
  ) {}

  async createMessage(data: CreateMessageDto) {
    return await this.messageRepository.save(data.message);
  }

  async handleReadChat(data: ReadChatDto) {
    await this.messageRepository.update(data.messages, { wasRead: true });
  }

  async getSingleChats(userId: string) {
    const chats = await this.singleChatRepository.find({
      where: [{ user1: Equal(userId) }, { user2: Equal(userId) }],
      relations: ['room'],
    });

    return chats.map((chat) => chat.room.id);
  }

  async getSingleMessages(authorId: string, recipientId: string) {
    const singleChat = await this.singleChatRepository.findOne({
      where: [
        { user1: Equal(authorId), user2: Equal(recipientId) },
        { user2: Equal(authorId), user1: Equal(recipientId) },
      ],
      relations: ['room'],
    });

    if (!singleChat) {
      const newRoomId = randomUUID();
      const newRoom = await this.roomRepository.create({ type: RoomType.SINGLE, id: newRoomId }).save();

      await this.singleChatRepository.create({ user1: authorId, user2: recipientId, room: newRoom }).save();

      return { room: newRoom.id, messages: [] };
    }

    const messages = await this.messageRepository.find({
      where: { room: Equal(singleChat.room.id) },
      order: { createdAt: 'ASC' },
    });

    return { room: singleChat.room.id, messages };
  }

  async getChats(userId: string) {
    const chats = await this.singleChatRepository
      .createQueryBuilder('singleChat')
      .select(['singleChat.room', 'singleChat.id'])
      .leftJoinAndSelect('singleChat.room', 'room')
      .leftJoinAndSelect('singleChat.user1', 'user1')
      .leftJoinAndSelect('singleChat.user2', 'user2')
      .leftJoinAndSelect(
        (qb) =>
          qb.select().distinctOn(['"m"."roomId"']).from(Message, 'm').orderBy({ 'm.roomId, m.createdAt': 'DESC' }),
        'message',
        '"message"."roomId" = room.id',
      )
      .where('singleChat.user1 = :userId OR singleChat.user2 = :userId', { userId })
      .orderBy('"createdAt"', 'DESC')
      .getRawMany();

    const response = chats.map((chat) => {
      const obj = {};

      Object.keys(chat).forEach((key) => {
        const [entity, entityKey] = key.split('_');

        if (entityKey) {
          obj[entity] = { ...obj?.[entity], [entityKey]: chat[key] };
        } else {
          obj['message'] = { ...obj?.['message'], [key]: chat[key] };
        }
      });

      return obj;
    });

    return response;
  }

  async getListOfRecipientsWithLastMessage(authorId: string, recipientUserName: string) {
    const recipient = await this.userService.getUserByUserName(recipientUserName);

    return await this.messageRepository
      .createQueryBuilder('msg')
      .select()
      .orderBy('msg.createdAt')
      .leftJoinAndSelect('msg.author', 'author')
      .leftJoinAndSelect('msg.recipient', 'recipient')
      .where(
        '(msg.author = :authorId AND msg.recipient = :recipient) OR (msg.author = :recipient AND msg.recipient = :authorId)',
        { authorId, recipient: recipient.id },
      )
      .getMany();
  }
}
