import { FilterableField, IDField } from '@nestjs-query/query-graphql';
import { ObjectType, GraphQLISODateTime, Field, Int } from '@nestjs/graphql';

@ObjectType('Restaurant')
export class RestaurantDTO {
  @IDField(() => Int)
  id!: number;

  @FilterableField()
  name!: string;

  @FilterableField()
  location!: string;

  @FilterableField()
  timezone!: string;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated!: Date;
}
