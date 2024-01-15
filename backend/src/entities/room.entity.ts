import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ExtendedBaseEntity } from 'src/common/entities/extended-base.entity';
import { RoomType } from '../enums/room.enum';
import { Message } from './message.entity';
import { SingleChat } from './single-chat.entity';

@Entity('room')
export class Room extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    default: RoomType.SINGLE,
  })
  type: RoomType;

  @OneToMany(() => SingleChat, (chat) => chat.id)
  @JoinColumn()
  singleChat: SingleChat;

  @OneToMany(() => Message, (message) => message.room)
  message: Message[];
}
