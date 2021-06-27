import { Mapper } from '../util/domain-mapper';
import { ReservationEntity } from './reservation.entity';
import { ReservationInputDTO } from './dto/reservation.input.dto';

export class ReservationMapper extends Mapper<
  ReservationEntity,
  ReservationInputDTO
> {
  toDomain(raw: ReservationInputDTO): ReservationEntity {
    const e = new ReservationEntity();
    e.restaurantId = raw.restaurantId;
    e.inventoryId = raw.restaurantId;
    e.name = raw.name;
    e.user = raw.user;
    e.size = raw.size;
    e.created = new Date();
    return e;
  }

  toDTO(t): ReservationInputDTO {
    return {
      restaurantId: t.restaurantId,
      inventoryId: t.inventoryId,
      name: t.name,
      user: t.user,
      size: t.size,
    };
  }

  attachId(id: string | number, e: ReservationEntity): void {
    e.id = +id;
  }
}
