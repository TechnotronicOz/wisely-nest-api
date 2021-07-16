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
import { InventoryService } from '../inventory/inventory.service';
import { mapAttach } from '../util/domain-mapper';

describe('ReservationService', () => {
  let service: ReservationService;
  let inventoryService: InventoryService;
  let repo: Repository<ReservationEntity>;
  const mockedQueryService = {
    query: jest.fn(() => Promise.resolve(reservation)),
    createOne: jest.fn(() => Promise.resolve(reservation)),
  };

  const mockedInventoryService = {
    findById: jest.fn(() => Promise.resolve(inventory)),
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
    name: 'Matt',
    size: 4,
  };
  const reservation: ReservationEntity = plainToClass(
    ReservationEntity,
    reservationRaw,
  );
  reservation.id = 1;
  reservation.inventory = inventory;

  repo = {
    find: jest.fn().mockImplementation(() => Promise.resolve()),
    create: jest.fn().mockImplementation(() => Promise.resolve(reservation)),
    save: jest.fn().mockImplementation(() => Promise.resolve(reservation)),
    findOneOrFail: jest
      .fn()
      .mockImplementation(() => Promise.resolve(reservation)),
  } as unknown as Repository<ReservationEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        InventoryService,
        {
          provide: 'InventoryService',
          useValue: mockedInventoryService,
        },
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
    inventoryService = module.get<InventoryService>(InventoryService);
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
      .spyOn(repo, 'find')
      .mockImplementation(() => Promise.resolve([reservation]));
    jest
      .spyOn(inventoryService, 'findById')
      .mockImplementation(() => Promise.resolve(inventory));
    repo.save = jest
      .fn()
      .mockImplementation(() => Promise.resolve(reservation));

    const b = await service.createOne(reservationRaw);
    expect(b).toBeInstanceOf(ReservationEntity);
    expect(b.size).toBe(reservationRaw.size);
    expect(b.emaill).toBe(reservationRaw.user);
    expect(b.inventoryId).toBe(reservationRaw.inventoryId);
    expect(inventoryService.findById).toHaveBeenCalled();
    expect(repo.find).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  describe('create', () => {
    it('should reject if inventoryId not found', async () => {
      jest
        .spyOn(inventoryService, 'findById')
        .mockImplementation(() => Promise.resolve(undefined));

      jest.spyOn(repo, 'find').mockImplementation(() => Promise.resolve([]));

      await expect(service.createOne(reservationRaw)).rejects.toThrowError(
        'inventory not found [id=1]',
      );
      expect(repo.create).toHaveBeenCalledTimes(0);
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

      jest
        .spyOn(inventoryService, 'findById')
        .mockImplementation(() => Promise.resolve(inventories[0]));

      jest
        .spyOn(repo, 'find')
        .mockImplementation(() => Promise.resolve(reservations));

      const newReservation: ReservationInputDTO = {
        restaurantId: 1,
        inventoryId: 1, // 17:15 timeslot, @ capacity
        user: 'matt3@mattcarter.io',
        name: 'Matt',
        size: 2,
      };

      await expect(service.createOne(newReservation)).rejects.toThrowError(
        'no reservations available for date/time/party size selected',
      );
      expect(repo.create).toHaveBeenCalledTimes(0);
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

      jest
        .spyOn(inventoryService, 'findById')
        .mockImplementation(() => Promise.resolve(inventories[0]));

      repo.find = jest
        .fn()
        .mockImplementation(() => Promise.resolve(reservations));

      repo.save = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ id: 2 }));

      const newReservation: ReservationInputDTO = {
        restaurantId: 1,
        inventoryId: 1, // 17:15 timeslot, with availability for 2
        user: 'matt3@mattcarter.io',
        name: 'Matt',
        size: 3,
      };

      await expect(service.createOne(newReservation)).rejects.toThrowError(
        'no reservations available for date/time/party size selected',
      );
      expect(repo.save).toHaveBeenCalledTimes(0);

      const newReservation2: ReservationInputDTO = {
        restaurantId: 1,
        inventoryId: 1, // 17:15 timeslot, with availability for 2
        user: 'matt4@mattcarter.io',
        name: 'Matt',
        size: 2,
      };
      const reservation = await service.createOne(newReservation2);
      expect(reservation).toBeInstanceOf(ReservationEntity);
      expect(reservation.id).toEqual(2);
      expect(reservation.size).toEqual(newReservation2.size);
      expect(reservation.emaill).toEqual(newReservation2.user);
      expect(reservation.inventoryId).toEqual(newReservation2.inventoryId);
      expect(reservation.restaurantId).toEqual(newReservation2.restaurantId);
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const reservation = new ReservationEntity();
    reservation.id = 1;
    reservation.name = 'Matt';
    reservation.emaill = 'matt@mattcarter.io';
    reservation.size = 2;
    reservation.restaurantId = 1;
    reservation.inventoryId = 1;

    const inventory = new InventoryEntity();
    inventory.id = 1;
    inventory.restaurantId = 1;
    inventory.date = '2021-06-22';
    inventory.time = '15:00';
    inventory.limit = 6;

    const res1 = plainToClass(ReservationEntity, {
      id: 2,
      user: 'user1@email.com',
      name: 'User1',
      size: 2,
      restaurantId: 1,
      inventoryId: 1,
    });

    const res2 = plainToClass(ReservationEntity, {
      id: 3,
      user: 'user2@email.com',
      name: 'User2',
      size: 2,
      restaurantId: 1,
      inventoryId: 1,
    });

    it('should not call any dao methods if the update is the same', async () => {
      jest
        .spyOn(inventoryService, 'findById')
        .mockImplementation(() => Promise.resolve(inventory));
      jest
        .spyOn(repo, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(reservation));
      repo.update = jest
        .fn()
        .mockImplementation(() => Promise.resolve({} as any));

      await service.update(1, { size: 2 });
      expect(repo.update).toBeCalledTimes(0);
      expect(inventoryService.findById).toBeCalledTimes(0);
    });

    it('should update a reservation only if we can fit it within the inventory constraint', async () => {
      jest
        .spyOn(inventoryService, 'findById')
        .mockImplementation(() => Promise.resolve(inventory));
      jest
        .spyOn(repo, 'find')
        .mockImplementation(() => Promise.resolve([reservation, res1, res2]));
      jest
        .spyOn(repo, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(reservation));

      // update from 2 to 1, which should be able to accommodate
      const update = await service.update(1, { size: 1 });
      expect(update.size).toEqual(1);
      expect(repo.find).toBeCalledTimes(1);
      expect(repo.find).toBeCalledWith({
        where: { inventoryId: 1, restaurantId: 1 },
      });
      expect(repo.update).toBeCalled();
      expect(repo.update).toBeCalledWith(1, { size: 1 });
      expect(repo.findOneOrFail).toBeCalled();
    });

    it('should throw an error if the update puts us over the limit', async () => {
      jest
        .spyOn(inventoryService, 'findById')
        .mockImplementation(() => Promise.resolve(inventory));
      jest
        .spyOn(repo, 'find')
        .mockImplementation(() => Promise.resolve([reservation, res1, res2]));
      jest
        .spyOn(repo, 'findOneOrFail')
        .mockImplementation(() => Promise.resolve(reservation));
      repo.update = jest
        .fn()
        .mockImplementation(() => Promise.resolve({} as any));

      // update from 2 to 4, would put us @ 8, 2 over our limit of 6
      await expect(service.update(1, { size: 4 })).rejects.toThrowError(
        'no reservations available for date/time/party size selected, unable to update',
      );
      expect(repo.find).toBeCalledTimes(1);
      expect(repo.find).toBeCalledWith({
        where: { inventoryId: 1, restaurantId: 1 },
      });
      expect(repo.findOneOrFail).toBeCalled();
      expect(repo.update).toBeCalledTimes(0);
    });
  });
});
