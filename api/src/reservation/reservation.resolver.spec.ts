import { ReservationResolver } from './reservation.resolver';
import { plainToClass } from 'class-transformer';
import { ReservationEntity } from './reservation.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getQueryServiceToken } from '@nestjs-query/core';
import { InventoryEntity } from '../inventory/inventory.entity';

describe('InventoryResolver', () => {
  let resolver: ReservationResolver;
  let mockCreate: jest.Mock;
  let mockUpdate: jest.Mock;

  const reservation = plainToClass(ReservationEntity, {
    id: 1,
    restaurantId: 1,
    inventoryId: 1,
    size: 5,
  });
  reservation.inventory = plainToClass(InventoryEntity, {
    id: 1,
    restaurantId: 1,
    limit: 10,
    date: '2021-06-22',
    time: '17:00',
    created: new Date(),
  });

  const mockedRepo = {
    count: jest.fn((id) => Promise.resolve(1)),
  };

  const mockedService = {
    query: jest.fn((query) => Promise.resolve([reservation])),
  };

  beforeEach(async () => {
    mockCreate = jest.fn(() => reservation);
    mockUpdate = jest.fn(() => reservation);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: getRepositoryToken(ReservationEntity),
          useValue: mockedRepo,
        },
        {
          provide: getQueryServiceToken(ReservationEntity),
          useValue: mockedService,
        },
        {
          provide: 'ReservationService',
          useValue: {
            createOne: mockCreate,
            update: mockUpdate,
          },
        },
        ReservationResolver,
      ],
    }).compile();

    resolver = module.get<ReservationResolver>(ReservationResolver);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call create on reservation service to create a reservation record', async () => {
    const createDto = {
      restaurantId: reservation.restaurantId,
      name: reservation.name,
      size: reservation.size,
      user: reservation.user,
      inventoryId: reservation.inventoryId,
    };
    expect(await resolver.createOneReservation(createDto)).toEqual(reservation);
    expect(mockCreate).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith(createDto);
  });

  it('should call update on reservation service to update reservation record', async () => {
    const otherReservation = new ReservationEntity();
    otherReservation.id = 2;
    otherReservation.user = 'matt@mattcarter.io';
    otherReservation.name = 'Matt';
    otherReservation.size = 4;
    otherReservation.restaurantId = 1;
    otherReservation.inventoryId = 1;
    otherReservation.created = new Date();
    await resolver.updateOneReservation(1, { size: 2 });
    expect(mockUpdate).toBeCalled();
    expect(mockUpdate).toHaveBeenCalledWith(1, { size: 2 });
  });
});
