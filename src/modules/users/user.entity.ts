import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../articles/article.entity';
import { FriendRequest } from '../friends/friend-requests.entity';
import { UserFriends } from '../friends/user-friends.entity';
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

  @OneToMany(() => FriendRequest, (fr) => fr.requestor)
  requesterIn: FriendRequest[];

  @OneToMany(() => FriendRequest, (fr) => fr.requestee)
  requesteeIn: FriendRequest[];

  @OneToMany(() => FriendRequest, (fr) => fr.requestor)
  userFriends1: UserFriends[];
  @OneToMany(() => FriendRequest, (fr) => fr.requestee)
  userFriends2: UserFriends[];
}
