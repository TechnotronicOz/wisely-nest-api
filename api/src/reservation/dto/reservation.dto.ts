import { FilterableField, IDField } from '@nestjs-query/query-graphql';
import { ObjectType, GraphQLISODateTime, Field, Int } from '@nestjs/graphql';

@ObjectType('Reservation')
export class ReservationDTO {
  @IDField(() => Int)
  id!: number;

  @FilterableField()
  name?: string;

  @FilterableField()
  user!: string;

  @FilterableField()
  size!: number;

  @FilterableField()
  restaurantId!: number;

  @FilterableField()
  inventoryId!: number;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated?: Date | null;
}
