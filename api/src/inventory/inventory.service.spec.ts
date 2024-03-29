import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { plainToClass } from 'class-transformer';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventoryEntity } from './inventory.entity';
import { Repository } from 'typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { getQueryServiceToken } from '@nestjs-query/core';

describe('InventoryService', () => {
  const restaurant = plainToClass(RestaurantEntity, {
    id: 1,
    name: "Matt's Place",
    location: 'Kansas City, MO',
    timezone: 'America/Central',
  });

  const inventoryDto = {
    restaurantId: 1,
    date: '2021-06-22',
    time: '16:15',
    limit: 5,
  };
  const inventory = plainToClass(InventoryEntity, inventoryDto);
  inventory.id = 1;

  let service: InventoryService;
  let restaurantService: RestaurantService;
  let repo: Repository<InventoryEntity>;
  const mockedQueryService = {
    query: jest.fn(() => Promise.resolve()),
    createOne: jest.fn(() => Promise.resolve(inventory)),
  };
  const mockedRestaurantService = {
    getById: jest.fn(() => Promise.resolve(restaurant)),
  };

  const setRepoImpl = (k) => {
    repo = {
      count: jest.fn(() => k),
      create: jest.fn(() => Promise.resolve(inventory)),
      save: jest.fn(() => Promise.resolve(inventory)),
      find: jest.fn(() => Promise.resolve([inventory])),
    } as unknown as Repository<InventoryEntity>;
  };

  beforeEach(async () => {
    setRepoImpl(Promise.resolve(0));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        RestaurantService,
        {
          provide: 'RestaurantService',
          useValue: mockedRestaurantService,
        },
        {
          provide: getRepositoryToken(InventoryEntity),
          useValue: repo,
        },
        {
          provide: getQueryServiceToken(InventoryEntity),
          useValue: mockedQueryService,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
    repo = module.get<Repository<InventoryEntity>>(
      getRepositoryToken(InventoryEntity),
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new inventory', async () => {
    jest
      .spyOn(restaurantService, 'getById')
      .mockImplementation(() => Promise.resolve(restaurant));
    const newInventory = await service.create(inventoryDto);
    expect(newInventory.date).toEqual(inventoryDto.date);
    expect(newInventory.time).toEqual(inventoryDto.time);
    expect(newInventory.limit).toEqual(inventoryDto.limit);
    expect(newInventory.restaurantId).toEqual(inventoryDto.restaurantId);
    expect(repo.save).toHaveBeenCalled();
  });

  it('should reject if provided with a non-existing restaurant', async () => {
    jest
      .spyOn(restaurantService, 'getById')
      .mockImplementation(() => Promise.resolve(null));

    await expect(service.create(inventoryDto)).rejects.toThrowError(
      'unable to find restaurant [id=1]',
    );
  });

  it('should reject if an existing inventory exist for this restaurantId/date/time combination', async () => {
    jest
      .spyOn(restaurantService, 'getById')
      .mockImplementation(() => Promise.resolve(restaurant));

    jest.spyOn(repo, 'count').mockImplementation(() => Promise.resolve(1));

    await expect(service.create(inventoryDto)).rejects.toThrowError(
      'cannot create inventory, conflicts with existing records',
    );
  });

  it('should create for a date range', async () => {
    jest
      .spyOn(restaurantService, 'getById')
      .mockImplementation(() => Promise.resolve(restaurant));

    jest
      .spyOn(service, 'createMany')
      .mockImplementation(() => Promise.resolve([inventory, inventory]));

    // repo find's no duplicates
    repo.find = jest.fn().mockImplementation(() => []);

    const newInventories = await service.createForRange({
      restaurantId: 1,
      limit: 10,
      startDate: '2021-06-22',
      startTime: '15:00',
      endDate: '2021-06-22',
      endTime: '15:30',
    });

    expect(newInventories.length).toEqual(2);
    newInventories.forEach((inv) => {
      expect(inv.id).toBeDefined();
      expect(inv.time).toBeDefined();
      expect(inv.date).toBeDefined();
      expect(inv.restaurantId).toEqual(1);
    });
    expect(service.createMany).toHaveBeenCalled();
  });

  it('should reject if create for range has duplicates in db', async () => {
    jest
      .spyOn(restaurantService, 'getById')
      .mockImplementation(() => Promise.resolve(restaurant));

    jest
      .spyOn(service, 'createMany')
      .mockImplementation(() => Promise.resolve([]));

    // find returns a duplicate for us!
    repo.find = jest.fn().mockImplementation(() => [inventory]);

    await expect(
      service.createForRange({
        restaurantId: 1,
        limit: 10,
        startDate: '2021-06-22',
        startTime: '15:00',
        endDate: '2021-06-22',
        endTime: '18:00',
      }),
    ).rejects.toThrowError(
      'inventory range has produced duplicates of existing records [ids=[1]]',
    );
    expect(service.createMany).toHaveBeenCalledTimes(0);
  });
});
