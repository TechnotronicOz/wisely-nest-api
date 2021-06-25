import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@nestjs-query/query-graphql';
import {
  ObjectType,
  GraphQLISODateTime,
  Field,
  Int,
  ID,
} from '@nestjs/graphql';
import { RestaurantDTO } from '../../restaurant/dto/restaurant.dto';

@ObjectType('Inventory')
@FilterableRelation('restaurant', () => RestaurantDTO, { disableRemove: true })
export class InventoryDTO {
  @IDField(() => ID)
  id?: number;

  @FilterableField(() => Int)
  limit!: number;

  @FilterableField(() => String)
  date!: string;

  @FilterableField(() => String)
  time!: string;

  @FilterableField(() => Number)
  restaurantId!: number;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated?: Date;
}
