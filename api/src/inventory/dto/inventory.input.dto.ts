import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { Relation } from '@nestjs-query/query-graphql';
import { RestaurantDTO } from '../../restaurant/dto/restaurant.dto';
import { IsCustomTime } from '../../common/time.validator';
import { IsCustomDate } from '../../common/date.validator';

@InputType('InventoryInput')
@Relation('restaurant', () => RestaurantDTO, { disableRemove: true })
export class InventoryInputDTO {
  @Field(() => Int)
  @IsNumber()
  limit!: number;

  @IsString()
  @Field()
  @IsCustomTime()
  time!: string;

  @IsString()
  @Field()
  @IsCustomDate()
  date!: string;

  @Field(() => Int)
  @IsNumber()
  restaurantId!: number;
}
