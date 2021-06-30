import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InventoryDTO } from './dto/inventory.dto';
import { InventoryEntity } from './inventory.entity';
import { InventoryService } from './inventory.service';
import { InventoryInputDTO } from './dto/inventory.input.dto';
import { InventoryRangeInputDTO } from './dto/inventory-range.input.dto';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';

@Resolver(() => InventoryDTO)
export class InventoryResolver {
  constructor(
    @OgmaLogger(InventoryResolver)
    private readonly logger: OgmaService,
    private readonly inventoryService: InventoryService,
  ) {}

  @Mutation(() => InventoryDTO)
  async createOneInventory(
    @Args('createInputData') createInputData: InventoryInputDTO,
  ): Promise<InventoryEntity> {
    this.logger.log(
      `creating one inventory [restaurantId=${createInputData.restaurantId}, date=${createInputData.date}, time=${createInputData.time}, limit=${createInputData.limit}]`,
    );
    return this.inventoryService.create(createInputData);
  }

  @Mutation(() => [InventoryDTO])
  async createManyInventories(
    @Args({ name: 'createInputData', type: () => [InventoryInputDTO] })
    createInputData: InventoryInputDTO[],
  ): Promise<InventoryEntity[]> {
    this.logger.log(`creating many inventory [${createInputData.length}]`);
    return this.inventoryService.createMany(createInputData);
  }

  @Mutation(() => [InventoryDTO])
  async createForRange(
    @Args({ name: 'input', type: () => InventoryRangeInputDTO })
    input: InventoryRangeInputDTO,
  ): Promise<InventoryEntity[]> {
    this.logger.log(
      `creating inventories for range [range=${JSON.stringify(input)}]`,
    );
    return this.inventoryService.createForRange(input);
  }
}
