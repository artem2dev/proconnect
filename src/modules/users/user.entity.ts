import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../articles/article.entity';
import { FriendRequest } from '../friends/friend-requests.entity';
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

  @OneToMany(() => FriendRequest, (fr) => fr.requester)
  requesterIn: FriendRequest[];

  @OneToMany(() => FriendRequest, (fr) => fr.requestee)
  requesteeIn: FriendRequest[];
}
