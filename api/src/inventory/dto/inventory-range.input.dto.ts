import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { Relation } from '@nestjs-query/query-graphql';
import { RestaurantDTO } from '../../restaurant/dto/restaurant.dto';
import { IsCustomTime } from '../../common/time.validator';
import { IsCustomDate } from '../../common/date.validator';

@InputType('InventoryRangeInput')
@Relation('restaurant', () => RestaurantDTO, { disableRemove: true })
export class InventoryRangeInputDTO {
  @Field(() => Int)
  @IsNumber()
  restaurantId!: number;

  @Field(() => Int)
  @IsNumber()
  limit!: number;

  @IsString()
  @Field(() => String)
  @IsCustomDate()
  startDate!: string;

  @IsString()
  @Field(() => String)
  @IsCustomTime()
  startTime!: string;

  @IsString()
  @Field(() => String)
  @IsCustomDate()
  endDate!: string;

  @IsString()
  @Field(() => String)
  @IsCustomTime()
  endTime!: string;
}
