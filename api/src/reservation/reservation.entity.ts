import { Column, Entity, ManyToOne, JoinTable, Index } from 'typeorm';
import { InventoryEntity } from '../inventory/inventory.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { BaseDBEntity } from '../common/entities/base.entity';
import { UserEntity } from '../users/user.entity';

@Entity('reservation')
@Index(['user'])
@Index(['restaurantId'])
@Index(['inventoryId'])
export class ReservationEntity extends BaseDBEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  size: number;

  @Column()
  restaurantId: number;

  @Column()
  inventoryId: number;

  @JoinTable()
  @ManyToOne(() => RestaurantEntity, (restaurant) => restaurant.inventories)
  restaurant: RestaurantEntity;

  @JoinTable()
  @ManyToOne(() => InventoryEntity, (inventory) => inventory.reservations)
  inventory: InventoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.reservations)
  user: UserEntity;

  // constructor(opts: NewReservation) {
  //   super();
  //   Object.keys(opts).forEach((k) => {
  //     this[k] = opts[k];
  //   });
  // }
}

export interface NewReservation {
  name: string;
  email: string;
  size: number;
  restaurantId: number;
  inventoryId: number;
}
