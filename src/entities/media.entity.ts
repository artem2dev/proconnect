import { User } from 'src/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;
}
