import { Body, Controller, Logger, Post } from '@nestjs/common';
import { InventoryInputDTO } from './dto/inventory.input.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  private readonly logger: Logger = new Logger(InventoryController.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createInventoryDto: InventoryInputDTO) {
    this.logger.log(
      `creating inventory [createInventoryDto=${JSON.stringify(
        createInventoryDto,
      )}]`,
    );
    return this.inventoryService.create(createInventoryDto);
  }
}
