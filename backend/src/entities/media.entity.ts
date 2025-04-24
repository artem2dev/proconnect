import { ExtendedBaseEntity } from 'src/common/entities/extended-base.entity';
import { User } from '../entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media extends ExtendedBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  bucketName: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  uploader: User;
}
