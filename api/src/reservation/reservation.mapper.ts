import { mapAttach, Mapper } from '../util/domain-mapper';
import { ReservationEntity } from './reservation.entity';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { ReservationUpdateDTO } from './dto/reservation.update.dto';

export class ReservationMapper extends Mapper<
  ReservationEntity,
  ReservationInputDTO,
  ReservationUpdateDTO
> {
  toDomain(raw: ReservationInputDTO | ReservationUpdateDTO): ReservationEntity {
    const e = new ReservationEntity();
    mapAttach<ReservationEntity, ReservationUpdateDTO>(e, raw);
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
