import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../articles/article.entity';
import { Message } from '../chat/message.entity';
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

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  banned: boolean;

  @Column()
  password: string;

  @OneToOne(() => Media, (media) => media.user)
  avatar: Media;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Message, (message) => message.author)
  messageAuthor: Message[];

  @OneToMany(() => Message, (message) => message.recipient)
  messageRecipient: Message[];

  @OneToMany(() => FriendRequest, (fr) => fr.requestor)
  requestorIn: FriendRequest[];

  @OneToMany(() => FriendRequest, (fr) => fr.requestee)
  requesteeIn: FriendRequest[];

  @OneToMany(() => UserFriends, (uf) => uf.user1)
  userFriends1: UserFriends[];
  @OneToMany(() => UserFriends, (uf) => uf.user2)
  userFriends2: UserFriends[];
}
