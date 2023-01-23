import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  author: User | string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  recipient: User | string;
}
