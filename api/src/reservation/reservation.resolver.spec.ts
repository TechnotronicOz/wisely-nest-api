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

  it('should call create on reservation Service to create a reservation record', async () => {
    expect(
      await resolver.createOneReservation({
        restaurantId: reservation.restaurantId,
        size: reservation.size,
        user: reservation.user,
        inventoryId: reservation.inventoryId,
      }),
    ).toEqual(reservation);
    expect(mockCreate).toHaveBeenCalled();
  });
});
