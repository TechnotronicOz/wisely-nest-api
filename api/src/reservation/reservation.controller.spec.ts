import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { InventoryInputDTO } from '../inventory/dto/inventory.input.dto';
import { plainToClass } from 'class-transformer';
import { InventoryEntity } from '../inventory/inventory.entity';
import { ReservationEntity } from './reservation.entity';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const inventoryRaw: InventoryInputDTO = {
    limit: 20,
    restaurantId: 1,
    date: '2021-06-22',
    time: '17:45',
  };
  const inventory: InventoryEntity = plainToClass(
    InventoryEntity,
    inventoryRaw,
  );
  inventory.id = 1;

  const reservationRaw: ReservationInputDTO = {
    restaurantId: 1,
    inventoryId: 1,
    user: 'matt@mattcarter.io',
    size: 4,
  };
  const reservation: ReservationEntity = plainToClass(
    ReservationEntity,
    reservationRaw,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation(() => Promise.resolve(reservation)),
            query: jest
              .fn()
              .mockImplementation(() => Promise.resolve([ReservationEntity])),
          },
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    controller = module.get<ReservationController>(ReservationController);
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call reservationService.create to create a new reservation', async () => {
    expect(await controller.create(reservationRaw)).toBe(reservation);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(reservationRaw);
  });
});
