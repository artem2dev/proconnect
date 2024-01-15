import { Column, Entity, JoinColumn, ManyToOne, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './article.entity';
import { FriendRequest } from './friend-requests.entity';
import { Media } from './media.entity';
import { UserFriends } from './user-friends.entity';

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

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  wasOnline: Date;

  @ManyToOne(() => Media, (media) => media.id, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  avatar: Media;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => FriendRequest, (fr) => fr.requestor)
  requestorIn: FriendRequest[];

  @OneToMany(() => FriendRequest, (fr) => fr.requestee)
  requesteeIn: FriendRequest[];

  @OneToMany(() => UserFriends, (uf) => uf.user1)
  userFriends1: UserFriends[];

  @OneToMany(() => UserFriends, (uf) => uf.user2)
  userFriends2: UserFriends[];

  @ManyToMany(() => Article, (a) => a.id)
  likedArticles: Article[];

  @ManyToMany(() => User, (u) => u.id, { cascade: true })
  likedComments: User[];
}
