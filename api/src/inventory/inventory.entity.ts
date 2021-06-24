import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { ReservationEntity } from '../reservation/reservation.entity';

@Entity()
export class InventoryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ nullable: false })
  limit!: number;

  @Column({ nullable: false, type: 'time without time zone' })
  time!: string;

  @Column({ nullable: false, type: 'date' })
  date!: string;

  @Column({ nullable: false })
  restaurantId!: number;

  @CreateDateColumn({ nullable: false, type: 'timestamp without time zone' })
  created!: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
  })
  updated: Date;

  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.inventories, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  restaurant: RestaurantEntity;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.inventory, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  reservations: ReservationEntity[];
}
