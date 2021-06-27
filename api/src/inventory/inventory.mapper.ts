import { Mapper } from '../util/domain-mapper';
import { InventoryEntity } from './inventory.entity';
import { InventoryInputDTO } from './dto/inventory.input.dto';

export class InventoryMapper extends Mapper<
  InventoryEntity,
  InventoryInputDTO
> {
  toDomain(raw: InventoryInputDTO): InventoryEntity {
    const e = new InventoryEntity();
    e.restaurantId = raw.restaurantId;
    e.date = raw.date;
    e.time = raw.time;
    e.limit = raw.limit;
    e.created = new Date();
    return e;
  }

  toDTO(t): InventoryInputDTO {
    return {
      restaurantId: t.restaurantId,
      date: t.date,
      time: t.time,
      limit: t.limit,
    };
  }

  attachId(id: string | number, e: InventoryEntity): void {
    e.id = +id;
  }
}
