import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FilterableRelation } from '@nestjs-query/query-graphql';
import { RestaurantDTO } from '../../restaurant/dto/restaurant.dto';
import { IsCustomTime } from '../../validators/time.validator';
import { IsCustomDate } from '../../validators/date.validator';

@InputType('InventoryUpdate')
@FilterableRelation('restaurant', () => RestaurantDTO, { disableRemove: true })
export class InventoryUpdateDTO {
  @Field(() => Int)
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsString()
  @Field(() => String)
  @IsCustomTime()
  @IsOptional()
  time?: string;

  @IsString()
  @Field(() => String)
  @IsCustomDate()
  @IsOptional()
  date?: string;
}
