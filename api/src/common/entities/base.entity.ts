import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Represents columns on all db entities
 */
export abstract class BaseDBEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created: Date = new Date();

  @UpdateDateColumn({ nullable: false, type: 'timestamp without time zone' })
  updated?: Date = new Date();
}
