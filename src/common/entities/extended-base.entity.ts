import { BaseEntity, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class ExtendedBaseEntity extends BaseEntity {
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  updatedAt: Date;
}
