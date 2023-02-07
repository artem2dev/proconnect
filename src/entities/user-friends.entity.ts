import { ExtendedBaseEntity } from 'src/common/entities/extended-base.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserFriends extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  user1: User;

  @ManyToOne(() => User, (user) => user.id)
  user2: User;
}
