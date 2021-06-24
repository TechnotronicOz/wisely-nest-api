import {
  FilterableField,
  FilterableRelation,
  IDField,
  Relation,
} from '@nestjs-query/query-graphql';
import { ObjectType, GraphQLISODateTime, Field, Int } from '@nestjs/graphql';
import { InventoryDTO } from '../../inventory/dto/inventory.dto';

@ObjectType('Reservation')
@FilterableRelation('inventory', () => InventoryDTO, {
  disableRemove: true,
})
export class ReservationDTO {
  @IDField(() => Int)
  id!: number;

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
