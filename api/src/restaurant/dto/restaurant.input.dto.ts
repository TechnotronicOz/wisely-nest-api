import { Field, InputType } from '@nestjs/graphql';
import { FilterableRelation, Relation } from '@nestjs-query/query-graphql';
import { InventoryDTO } from '../../inventory/dto/inventory.dto';
import { ReservationDTO } from '../../reservation/dto/reservation.dto';
import { IsString } from 'class-validator';

@InputType('RestaurantInput')
@FilterableRelation('inventory', () => InventoryDTO, { disableRemove: true })
@FilterableRelation('reservation', () => ReservationDTO, {
  disableRemove: true,
})
export class RestaurantInputDTO {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsString()
  location!: string;

  @Field()
  @IsString()
  timezone!: string;
}
