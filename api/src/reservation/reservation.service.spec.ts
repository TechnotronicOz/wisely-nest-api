import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { InventoryInputDTO } from '../inventory/dto/inventory.input.dto';
import { InventoryEntity } from '../inventory/inventory.entity';
import { plainToClass } from 'class-transformer';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { ReservationEntity } from './reservation.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getQueryServiceToken } from '@nestjs-query/core';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InventoryDTO } from '../inventory/dto/inventory.dto';
import { ReservationDTO } from './dto/reservation.dto';

describe('ReservationService', () => {
  let service: ReservationService;
  let repo: Repository<ReservationEntity>;
  const mockedQueryService = {
    query: jest.fn(() => Promise.resolve(reservation)),
    createOne: jest.fn(() => Promise.resolve(reservation)),
  };

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
  reservation.id = 1;
  reservation.inventory = inventory;

  beforeEach(async () => {
    repo = {
      find: jest.fn().mockImplementation(() => Promise.resolve()),
      create: jest.fn().mockImplementation(() => Promise.resolve(reservation)),
    } as unknown as Repository<ReservationEntity>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(ReservationEntity),
          useValue: repo,
        },
        {
          provide: getQueryServiceToken(ReservationEntity),
          useValue: mockedQueryService,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    repo = module.get<Repository<ReservationEntity>>(
      getRepositoryToken(ReservationEntity),
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create inventory', async () => {
    jest
      .spyOn(service, 'query')
      .mockImplementation(() => Promise.resolve([reservation]));
    repo.create = jest
      .fn()
      .mockImplementation(() => Promise.resolve(reservation));
    const b = await service.create(reservationRaw);
    expect(b).toBeInstanceOf(ReservationEntity);
    expect(b.size).toBe(reservationRaw.size);
    expect(b.user).toBe(reservationRaw.user);
    expect(b.inventoryId).toBe(reservationRaw.inventoryId);
    expect(service.query).toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalled();
  });

  it('should reject if inventoryId not found', async () => {
    jest.spyOn(service, 'query').mockImplementation(() => Promise.resolve([]));

    service
      .create(reservationRaw)
      .then(() => {
        expect(repo.create).toHaveBeenCalledTimes(0);
      })
      .catch((err: Error) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('inventory not found [id=1]');
        expect(repo.create).toHaveBeenCalledTimes(0);
      });
  });

  it("should reject if inventory is at it's limit", async () => {
    const inventoriesRaw: InventoryDTO[] = [
      {
        // id 1
        id: 1,
        limit: 10,
        restaurantId: 1,
        date: '2021-06-22',
        time: '17:15',
        created: new Date(),
      },
      {
        id: 2,
        limit: 10,
        restaurantId: 1,
        date: '2021-06-22',
        time: '17:30',
        created: new Date(),
      },
      {
        id: 3,
        limit: 10,
        restaurantId: 1,
        date: '2021-06-22',
        time: '17:45',
        created: new Date(),
      },
      {
        id: 4,
        limit: 10,
        restaurantId: 1,
        date: '2021-06-22',
        time: '18:00',
        created: new Date(),
      },
    ];
    const inventories: InventoryEntity[] = inventoriesRaw.map(
      (dto: InventoryInputDTO) => plainToClass(InventoryEntity, dto),
    );

    // these reservations put inventory 1 @ capacity
    const reservationsRaw: ReservationDTO[] = [
      {
        id: 1,
        restaurantId: 1,
        inventoryId: 1,
        user: 'matt@mattcarter.io',
        size: 5,
        created: new Date(),
      },
      {
        id: 2,
        restaurantId: 1,
        inventoryId: 1,
        user: 'matt2@mattcarter.io',
        size: 5,
        created: new Date(),
      },
    ];
    const reservations: ReservationEntity[] = reservationsRaw.map((r) =>
      plainToClass(ReservationEntity, r),
    );

    reservations[0].inventory = inventories[0];
    reservations[1].inventory = inventories[0];

    jest
      .spyOn(service, 'query')
      .mockImplementation(() => Promise.resolve(reservations));

    const newReservation: ReservationInputDTO = {
      restaurantId: 1,
      inventoryId: 1, // 17:15 timeslot, @ capacity
      user: 'matt3@mattcarter.io',
      size: 2,
    };

    service
      .create(newReservation)
      .then(() => {
        expect(repo.create).toHaveBeenCalledTimes(0);
      })
      .catch((err: Error) => {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(
          'no reservations available for date/time/party size selected',
        );
        expect(repo.create).toHaveBeenCalledTimes(0);
      });
  });

  it("should reject if reservation size would exhaust the inventory's limit", async () => {
    const inventoriesRaw: InventoryDTO[] = [
      {
        // id 1
        id: 1,
        limit: 10,
        restaurantId: 1,
        date: '2021-06-22',
        time: '17:15',
        created: new Date(),
      },
      {
        id: 2,
        limit: 10,
        restaurantId: 1,
        date: '2021-06-22',
        time: '17:30',
        created: new Date(),
      },
      {
        id: 3,
        limit: 10,
        restaurantId: 1,
        date: '2021-06-22',
        time: '17:45',
        created: new Date(),
      },
      {
        id: 4,
        limit: 10,
        restaurantId: 1,
        date: '2021-06-22',
        time: '18:00',
        created: new Date(),
      },
    ];
    const inventories: InventoryEntity[] = inventoriesRaw.map(
      (dto: InventoryInputDTO) => plainToClass(InventoryEntity, dto),
    );

    // these reservations put inventory 1 with capacity for 2
    const reservationsRaw: ReservationDTO[] = [
      {
        id: 1,
        restaurantId: 1,
        inventoryId: 1,
        user: 'matt@mattcarter.io',
        size: 5,
        created: new Date(),
      },
      {
        id: 2,
        restaurantId: 1,
        inventoryId: 1,
        user: 'matt2@mattcarter.io',
        size: 3,
        created: new Date(),
      },
    ];
    const reservations: ReservationEntity[] = reservationsRaw.map((r) =>
      plainToClass(ReservationEntity, r),
    );

    reservations[0].inventory = inventories[0];
    reservations[1].inventory = inventories[0];

    jest
      .spyOn(service, 'query')
      .mockImplementation(() => Promise.resolve(reservations));

    const newReservation: ReservationInputDTO = {
      restaurantId: 1,
      inventoryId: 1, // 17:15 timeslot, with availability for 2
      user: 'matt3@mattcarter.io',
      size: 3,
    };

    try {
      const reservation = await service.create(newReservation);
      expect(reservation).toBeUndefined();
      expect(repo.create).toHaveBeenCalledTimes(0);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toEqual(
        'no reservations available for date/time/party size selected',
      );
      expect(repo.create).toHaveBeenCalledTimes(0);
    }

    const newReservation2: ReservationInputDTO = {
      restaurantId: 1,
      inventoryId: 1, // 17:15 timeslot, with availability for 2
      user: 'matt4@mattcarter.io',
      size: 2,
    };
    try {
      const reservation = await service.create(newReservation2);
      expect(reservation).toBeInstanceOf(ReservationEntity);
      expect(reservation.size).toEqual(newReservation2.size);
      expect(reservation.user).toEqual(newReservation2.user);
      expect(reservation.inventoryId).toEqual(newReservation2.inventoryId);
      expect(reservation.restaurantId).toEqual(newReservation2.restaurantId);
      expect(repo.create).toHaveBeenCalled();
    } catch {}
  });
});
