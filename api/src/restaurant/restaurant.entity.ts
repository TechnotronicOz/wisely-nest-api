import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InventoryEntity } from '../inventory/inventory.entity';
import { ReservationEntity } from '../reservation/reservation.entity';

@Entity()
export class RestaurantEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ default: 'America/Central' })
  timezone: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created!: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updated: Date;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.restaurant, {
    onDelete: 'CASCADE',
  })
  reservations: ReservationEntity[];

  @OneToMany(() => InventoryEntity, (inventory) => inventory.restaurant, {
    onDelete: 'CASCADE',
  })
  inventories: InventoryEntity[];
}
