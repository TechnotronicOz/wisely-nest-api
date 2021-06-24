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
});
