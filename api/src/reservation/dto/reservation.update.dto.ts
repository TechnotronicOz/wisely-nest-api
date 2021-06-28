import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, Min } from 'class-validator';
import { InventoryDTO } from '../../inventory/dto/inventory.dto';
import { FilterableRelation } from '@nestjs-query/query-graphql';
import { RestaurantDTO } from '../../restaurant/dto/restaurant.dto';

@InputType('ReservationUpdate')
@FilterableRelation('inventory', () => InventoryDTO, { disableRemove: true })
@FilterableRelation('restaurant', () => RestaurantDTO, { disableRemove: true })
export class ReservationUpdateDTO {
  @Field()
  @IsNumber()
  @Min(1)
  size!: number;
}
