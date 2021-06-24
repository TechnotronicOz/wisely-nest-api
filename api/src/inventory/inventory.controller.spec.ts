import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { plainToClass } from 'class-transformer';
import { InventoryEntity } from './inventory.entity';
import { InventoryInputDTO } from './dto/inventory.input.dto';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  const inventoryRaw: InventoryInputDTO = {
    restaurantId: 1,
    date: '2021-06-22',
    time: '16:15',
    limit: 15,
  };

  const inventory = plainToClass(InventoryEntity, inventoryRaw);

  async function bootstrap(impl) {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: {
            create: jest.fn().mockImplementationOnce(() => impl),
          },
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    controller = module.get<InventoryController>(InventoryController);
  }

  beforeEach(async () => {
    await bootstrap(Promise.resolve(inventory));
  });

  afterEach(() => jest.resetAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an inventory', async () => {
    jest
      .spyOn(service, 'create')
      .mockImplementation(() => Promise.resolve(inventory));
    expect(await controller.create(inventoryRaw)).toBe(inventory);
  });

  it('should handle an error thrown from the service', async () => {
    await bootstrap(Promise.reject('there is a problem'));
    jest
      .spyOn(service, 'create')
      .mockImplementation(() => Promise.reject('there is a problem'));
    controller.create(inventoryRaw).catch((err) => {
      expect(err).toBe('there is a problem');
    });
  });
});
