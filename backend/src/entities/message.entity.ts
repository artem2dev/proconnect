import { ExtendedBaseEntity } from 'src/common/entities/extended-base.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity()
export class Message extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
  })
  text: string;

  @Column({ type: 'boolean', default: false })
  wasRead: boolean;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  roomId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Room, (room) => room.id, { onDelete: 'CASCADE' })
  room: Room;
}
