import { Article } from 'src/modules/articles/article.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Media } from '../media/media.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  banned: boolean;

  @Column()
  password: string;

  @OneToOne(() => Media, (media) => media.user)
  avatar: Media;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
