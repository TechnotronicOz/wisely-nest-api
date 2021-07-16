import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { hashPass } from '../util/passwords';
import { BaseDBEntity } from '../common/entities/base.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { ReservationEntity } from '../reservation/reservation.entity';
import { OmitType } from '@nestjs/graphql';

@Entity('user_store')
export class UserEntity extends BaseDBEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword(): Promise<string> {
    this.password = await hashPass(this.password);
    return this.password;
  }

  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.user, {
    onDelete: 'CASCADE',
  })
  restaurants?: RestaurantEntity[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.user, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  reservations?: ReservationEntity[];

  // constructor(email: string, password: string) {
  //   super();
  //   this.email = email;
  //   this.password = password;
  // }

  asUserWithoutSecrets(): UserWithoutSecrets {
    return this as UserWithoutSecrets;
  }
}

type UserKeys = keyof UserEntity;
type UserKeysWithoutSecrets = Exclude<UserKeys, 'password'>;
export type UserWithoutSecrets = Pick<UserEntity, UserKeysWithoutSecrets>;
