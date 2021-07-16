import { Column, Entity, OneToMany, Index, ManyToOne } from 'typeorm';
import { InventoryEntity } from '../inventory/inventory.entity';
import { ReservationEntity } from '../reservation/reservation.entity';
import { BaseDBEntity } from '../common/entities/base.entity';
import { Int } from '@nestjs/graphql';
import { UserEntity } from '../users/user.entity';

@Entity('restaurant')
@Index(['name', 'location'], { unique: true })
export class RestaurantEntity extends BaseDBEntity {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ default: 'America/Central' })
  timezone: string;

  @Column()
  userId: number;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.restaurant, {
    onDelete: 'CASCADE',
  })
  reservations: ReservationEntity[];

  @OneToMany(() => InventoryEntity, (inventory) => inventory.restaurant, {
    onDelete: 'CASCADE',
  })
  inventories: InventoryEntity[];

  @ManyToOne(() => UserEntity, (user) => user.restaurants)
  user: UserEntity;

  // constructor(
  //   name: string,
  //   location: string,
  //   timezone: string,
  //   userId: number,
  // ) {
  //   super();
  //   this.name = name;
  //   this.location = location;
  //   this.timezone = timezone;
  //   this.userId = userId;
  // }
}
