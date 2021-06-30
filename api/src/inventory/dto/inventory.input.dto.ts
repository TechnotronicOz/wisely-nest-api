import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { FilterableRelation } from '@nestjs-query/query-graphql';
import { RestaurantDTO } from '../../restaurant/dto/restaurant.dto';
import { IsCustomTime } from '../../validators/time.validator';
import { IsCustomDate } from '../../validators/date.validator';

@InputType('InventoryInput')
@FilterableRelation('restaurant', () => RestaurantDTO, { disableRemove: true })
export class InventoryInputDTO {
  @Field(() => Int)
  @IsNumber()
  limit!: number;

  @IsString()
  @Field(() => String)
  @IsCustomTime()
  time!: string;

  @IsString()
  @Field(() => String)
  @IsCustomDate()
  date!: string;

  @Field(() => Int)
  @IsNumber()
  restaurantId!: number;
}
