import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { InventoryDTO } from '../../inventory/dto/inventory.dto';
import { FilterableRelation } from '@nestjs-query/query-graphql';
import { RestaurantDTO } from '../../restaurant/dto/restaurant.dto';

@InputType('ReservationInput')
@FilterableRelation('inventory', () => InventoryDTO, { disableRemove: true })
@FilterableRelation('restaurant', () => RestaurantDTO, { disableRemove: true })
export class ReservationInputDTO {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNumber()
  @Min(1)
  size!: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  inventoryId!: number;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  restaurantId!: number;
}
