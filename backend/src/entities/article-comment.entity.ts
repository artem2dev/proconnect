import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExtendedBaseEntity } from 'src/common/entities/extended-base.entity';
import { User } from '../entities/user.entity';
import { Article } from './article.entity';
import { Media } from './media.entity';

@Entity()
export class ArticleComment extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Media, (m) => m.id, { nullable: true })
  media: Media;

  @Column()
  comment: string;

  @Column({ nullable: true })
  authorId: string;

  @ManyToOne(() => User)
  author: User;

  @Column({ nullable: true })
  articleId: string;

  @ManyToOne(() => Article)
  article: Article;

  @ManyToMany(() => User, (u) => u.id, { cascade: true })
  @JoinTable()
  likes: User[];
}
