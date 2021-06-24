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
    expect(await service.create(inventoryDto)).toBe(inventory);
    expect(repo.create).toHaveBeenCalled();
  });

  it('should reject if provided with a non-existing restaurant', async () => {
    jest
      .spyOn(restaurantService, 'getById')
      .mockImplementation(() => Promise.resolve(null));

    service.create(inventoryDto).catch((err: Error) => {
      expect(err.message).toEqual('unable to find restaurant [id=1]');
    });
  });

  it('should reject if an existing inventory exist for this restaurantId/date/time combination', async () => {
    jest
      .spyOn(restaurantService, 'getById')
      .mockImplementation(() => Promise.resolve(restaurant));

    jest.spyOn(repo, 'count').mockImplementation(() => Promise.resolve(1));

    service.create(inventoryDto).catch((err: Error) => {
      expect(err.message).toEqual(
        'cannot create inventory, conflicts with existing records',
      );
    });
  });
});
