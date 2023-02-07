import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ExtendedBaseEntity } from 'src/common/entities/extended-base.entity';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity()
export class SingleChat extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user1: User | string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user2: User | string;

  @ManyToOne(() => Room, (room) => room.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  room: Room;
}
