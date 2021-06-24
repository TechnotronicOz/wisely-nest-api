import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InventoryDTO } from './dto/inventory.dto';
import { InventoryEntity } from './inventory.entity';
import { InventoryService } from './inventory.service';
import { InventoryInputDTO } from './dto/inventory.input.dto';
import { Logger } from '@nestjs/common';

@Resolver(() => InventoryDTO)
export class InventoryResolver {
  private readonly logger: Logger = new Logger(InventoryResolver.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @Mutation(() => InventoryDTO)
  async createOneInventory(
    @Args('createInputData') createInputData: InventoryInputDTO,
  ): Promise<InventoryEntity> {
    this.logger.log(
      `creating one inventory [restaurantId=${createInputData.restaurantId}, date=${createInputData.date}, time=${createInputData.time}, limit=${createInputData.limit}]`,
    );
    return this.inventoryService.create(createInputData);
  }
}
