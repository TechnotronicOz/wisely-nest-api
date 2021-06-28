import { InventoryResolver } from './inventory.resolver';
import { plainToClass } from 'class-transformer';
import { InventoryEntity } from './inventory.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getQueryServiceToken } from '@nestjs-query/core';

describe('InventoryResolver', () => {
  let resolver: InventoryResolver;
  let mockCreate: jest.Mock;
  let mockCreateMany: jest.Mock;
  let mockCreateForRange: jest.Mock;

  const inventory = plainToClass(InventoryEntity, {
    id: 1,
    restaurantId: 1,
    limit: 10,
    time: '15:00',
    date: '2021-06-22',
  });

  const mockedRepo = {
    count: jest.fn((id) => Promise.resolve(1)),
  };

  const mockedService = {
    query: jest.fn((query) => Promise.resolve([inventory])),
  };

  beforeEach(async () => {
    mockCreate = jest.fn(() => inventory);
    mockCreateMany = jest.fn(() => inventory);
    mockCreateForRange = jest.fn(() => inventory);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(InventoryEntity),
          useValue: mockedRepo,
        },
        {
          provide: getQueryServiceToken(InventoryEntity),
          useValue: mockedService,
        },
        {
          provide: 'InventoryService',
          useValue: {
            create: mockCreate,
            createMany: mockCreateMany,
            createForRange: mockCreateForRange,
          },
        },
        InventoryResolver,
      ],
    }).compile();

    resolver = module.get<InventoryResolver>(InventoryResolver);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should call create on inventoryService to create an inventory record', async () => {
    expect(
      await resolver.createOneInventory({
        restaurantId: inventory.restaurantId,
        limit: inventory.limit,
        date: inventory.date,
        time: inventory.time,
      }),
    ).toStrictEqual(inventory);
    expect(mockCreate).toHaveBeenCalled();
  });

  it('should call createMany to create multiple', async () => {
    const inventory2 = plainToClass(InventoryEntity, {
      id: 2,
      restaurantId: 1,
      limit: 10,
      time: '15:30',
      date: '2021-06-22',
    });
    await resolver.createManyInventories([inventory, inventory2]);
    expect(mockCreateMany).toHaveBeenCalled();
    expect(mockCreateMany).toHaveBeenCalledWith([inventory, inventory2]);
  });

  it('should call createForRange to create multiple', async () => {
    const dto = {
      restaurantId: 1,
      limit: 5,
      startDate: '2021-06-22',
      startTime: '15:00',
      endDate: '2021-06-22',
      endTime: '19:00',
    };
    await resolver.createForRange(dto);
    expect(mockCreateForRange).toHaveBeenCalled();
    expect(mockCreateForRange).toHaveBeenCalledWith(dto);
  });
});
