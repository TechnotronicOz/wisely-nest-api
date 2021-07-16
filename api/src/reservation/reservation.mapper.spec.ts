import { ReservationEntity } from './reservation.entity';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { ReservationMapper } from './reservation.mapper';

describe('ReservationMapper', () => {
  it('should map InventoryInputDTO to InventoryEntity', () => {
    const e = new ReservationEntity();
    e.restaurantId = 1;
    e.inventoryId = 1;
    e.name = 'Matt';
    e.emaill = 'matt@mattcarter.io';
    e.size = 2;

    const dto = new ReservationInputDTO();
    dto.restaurantId = 1;
    dto.inventoryId = 1;
    dto.name = 'Matt';
    dto.user = 'matt@mattcarter.io';
    dto.size = 2;

    const m = new ReservationMapper();
    const mappedEntity = m.toDomain(dto);
    expect(mappedEntity).toBeInstanceOf(ReservationEntity);
    expect(mappedEntity.restaurantId).toEqual(dto.restaurantId);
    expect(mappedEntity.inventoryId).toEqual(dto.inventoryId);
    expect(mappedEntity.name).toEqual(dto.name);
    expect(mappedEntity.emaill).toEqual(dto.user);
    expect(mappedEntity.size).toEqual(dto.size);
  });

  it('should map DTO-like object to ReservationInputDTO', () => {
    const e = new ReservationEntity();
    e.restaurantId = 1;
    e.inventoryId = 1;
    e.name = 'Matt';
    e.emaill = 'matt@mattcarter.io';
    e.size = 2;

    const dto = new ReservationInputDTO();
    dto.restaurantId = 1;
    dto.inventoryId = 1;
    dto.name = 'Matt';
    dto.user = 'matt@mattcarter.io';
    e.size = 2;

    const m = new ReservationMapper();
    const mappedDto = m.toDTO(e);
    expect(mappedDto.restaurantId).toEqual(e.restaurantId);
    expect(mappedDto.inventoryId).toEqual(e.inventoryId);
    expect(mappedDto.user).toEqual(e.emaill);
    expect(mappedDto.name).toEqual(e.name);
    expect(mappedDto.size).toEqual(e.size);
  });

  it('should attach id to the Entity', () => {
    const e = new ReservationEntity();
    e.restaurantId = 1;
    e.restaurantId = 1;
    e.emaill = 'matt@mattcarter.io';
    e.name = 'Matt';
    e.size = 2;

    const m = new ReservationMapper();
    m.attachId(1, e);
    expect(e.id).toEqual(1);
  });
});
