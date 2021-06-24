import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { InventoryEntity } from './inventory.entity';
import { InventoryDTO } from './dto/inventory.dto';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { InventoryInputDTO } from './dto/inventory.input.dto';
import { InventoryResolver } from './inventory.resolver';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([InventoryEntity])],
      resolvers: [
        {
          DTOClass: InventoryDTO,
          EntityClass: InventoryEntity,
          CreateDTOClass: InventoryInputDTO,
          UpdateDTOClass: InventoryInputDTO,
          create: { disabled: true },
          update: { disabled: true },
        },
      ],
    }),
    RestaurantModule,
  ],
  providers: [InventoryService, InventoryResolver],
  exports: [InventoryEntity, InventoryService],
})
export class InventoryModule {}
