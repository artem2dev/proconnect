import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  EntityManager,
  EntityMetadata,
  EntitySchema,
  getConnection,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ExtendedBaseEntity extends BaseEntity {
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  updatedAt: Date;

  /**
   * Omits properties from an entity.
   * @param {string | string[]} field - property key string or string array of properties to omit from an entity.
   */
  omit(field: string | string[]): void {
    if (Array.isArray(field)) {
      field.forEach((key) => {
        this[key] = undefined;
      });
      return;
    }

    this[field] = undefined;
    return;
  }

  /**
   * Updates entity in database with the given object.
   * @param newData - this objects properties
   * @returns Promise of an updated entity
   */
  update(newData: Partial<typeof this>): Promise<this> {
    Object.keys(newData).forEach((key) => (this[key] = newData[key]));

    return this.save();
  }
}
