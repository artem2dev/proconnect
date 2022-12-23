import { Article } from 'src/articles/article.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];
}
