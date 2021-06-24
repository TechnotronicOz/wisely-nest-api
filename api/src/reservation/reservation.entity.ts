import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { InventoryEntity } from '../inventory/inventory.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

@Entity()
export class ReservationEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column()
  user: string;

  @Column()
  size: number;

  @Column()
  restaurantId: number;

  @Column()
  inventoryId: number;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created!: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updated: Date;

  @JoinTable()
  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.inventories)
  restaurant: RestaurantEntity;

  @JoinTable()
  @ManyToOne(() => InventoryEntity, (inventory) => inventory.reservations)
  inventory: InventoryEntity;
}
