import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@nestjs-query/query-graphql';
import { ObjectType, GraphQLISODateTime, Field, Int } from '@nestjs/graphql';
import { RestaurantDTO } from '../../restaurant/dto/restaurant.dto';

@ObjectType('Inventory')
@FilterableRelation('restaurant', () => RestaurantDTO, { disableRemove: true })
export class InventoryDTO {
  @IDField(() => Int)
  id!: number;

  @FilterableField(() => Int)
  limit!: number;

  @FilterableField()
  date!: string;

  @FilterableField()
  time!: string;

  @FilterableField()
  restaurantId!: number;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated?: Date;
}

