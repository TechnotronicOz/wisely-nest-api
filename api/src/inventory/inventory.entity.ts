import { Column, Entity, ManyToOne, OneToMany, Index } from 'typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { ReservationEntity } from '../reservation/reservation.entity';
import { BaseDBEntity } from '../common/entities/base.entity';

@Entity('inventory')
@Index(['restaurantId', 'date', 'time'], { unique: true })
export class InventoryEntity extends BaseDBEntity {
  @Column({ nullable: false })
  limit!: number;

  @Column({ nullable: false, type: 'time without time zone' })
  time!: string;

  @Column({ nullable: false, type: 'date' })
  date!: string;

  @Column({ nullable: false })
  restaurantId!: number;

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

  // constructor(limit: number, date: string, time: string, restaurantId: number) {
  //   super();
  //   this.limit = limit;
  //   this.date = date;
  //   this.time = time;
  //   this.restaurantId = restaurantId;
  // }
}
