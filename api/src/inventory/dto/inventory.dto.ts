import { FilterableField, IDField } from '@nestjs-query/query-graphql';
import {
  ObjectType,
  GraphQLISODateTime,
  Field,
  Int,
  ID,
} from '@nestjs/graphql';

@ObjectType('Inventory')
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
