import { BaseEntity, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class ExtendedBaseEntity extends BaseEntity {
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  updatedAt: Date;

  /**
   * Omits properties from an entity.
   *
   * Property names can include nested children properties. I.E "author.password"
   * @param {string | string[]} field - property key string or string array of properties to omit from an entity.
   */
  omit(field: string | string[]): void {
    const omitNested = (splittedString: string[]) => {
      if (splittedString?.length > 0) {
        let tempObj = this;

        splittedString.forEach((key, index) => {
          if (!tempObj[key]) {
            throw new Error('Property name does not exist');
          }

          if (index === splittedString.length - 1) {
            delete tempObj[key];
            return;
          }

          tempObj = tempObj[key];
        });
      }
    };

    if (Array.isArray(field)) {
      field.forEach((key) => {
        const splittedString = key.split('.');

        if (splittedString?.length > 1) {
          omitNested(splittedString);
          return;
        }

        this[key] = undefined;
      });

      return;
    }

    const splittedString = field.split('.');

    if (splittedString?.length > 1) {
      omitNested(splittedString);
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
  update(newData: Partial<this>): Promise<this> {
    Object.keys(newData).forEach((key) => (this[key] = newData[key]));

    return this.save();
  }
}
