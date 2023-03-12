import { ExtendedBaseEntity } from 'src/common/entities/extended-base.entity';
import { User } from 'src/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleComment } from './article-comment.entity';
import { Media } from './media.entity';

@Entity()
export class Article extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Media, (m) => m.id, { nullable: true })
  media: Media;

  @Column()
  title: string;

  @Column({ nullable: true })
  authorId: string;

  @ManyToOne(() => User)
  author: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isPrivate: boolean;

  @OneToMany(() => ArticleComment, (ac) => ac.article)
  @JoinColumn()
  comments: ArticleComment[];

  @ManyToMany(() => User, (u) => u.id, { cascade: true })
  @JoinTable()
  likes: User[];
}
