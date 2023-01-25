import { ExtendedBaseEntity } from 'src/common/entities/extended-base.entity';
import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  imageId: string;

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
}
