import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  author: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isPrivate: boolean;
}
