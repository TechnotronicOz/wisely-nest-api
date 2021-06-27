import { InventoryEntity } from './inventory.entity';
import { InventoryInputDTO } from './dto/inventory.input.dto';
import { InventoryMapper } from './inventory.mapper';

describe('InventoryMapper', () => {
  it('should map InventoryInputDTO to InventoryEntity', () => {
    const e = new InventoryEntity();
    e.restaurantId = 1;
    e.date = '2021-06-22';
    e.time = '16:00';
    e.limit = 5;

    const dto = new InventoryInputDTO();
    dto.restaurantId = 1;
    dto.date = '2021-06-22';
    dto.time = '16:00';
    dto.limit = 5;

    const m = new InventoryMapper();
    const mappedEntity = m.toDomain(dto);
    expect(mappedEntity).toBeInstanceOf(InventoryEntity);
    expect(mappedEntity.restaurantId).toEqual(dto.restaurantId);
    expect(mappedEntity.date).toEqual(dto.date);
    expect(mappedEntity.time).toEqual(dto.time);
    expect(mappedEntity.limit).toEqual(dto.limit);
  });

  it('should map DTO-like object to InventoryInputDTO', () => {
    const e = new InventoryEntity();
    e.restaurantId = 1;
    e.date = '2021-06-22';
    e.time = '16:00';
    e.limit = 5;

    const dto = new InventoryInputDTO();
    dto.restaurantId = 1;
    dto.date = '2021-06-22';
    dto.time = '16:00';
    dto.limit = 5;

    const m = new InventoryMapper();
    const mappedDto = m.toDTO(e);
    expect(mappedDto.restaurantId).toEqual(e.restaurantId);
    expect(mappedDto.date).toEqual(e.date);
    expect(mappedDto.time).toEqual(e.time);
    expect(mappedDto.limit).toEqual(e.limit);
  });

  it('should attach id to the Entity', () => {
    const e = new InventoryEntity();
    e.restaurantId = 1;
    e.date = '2021-06-22';
    e.time = '16:00';
    e.limit = 5;

    const m = new InventoryMapper();
    m.attachId(1, e);
    expect(e.id).toEqual(1);
  });
});
