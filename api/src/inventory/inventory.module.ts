import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { InventoryEntity } from './inventory.entity';
import { InventoryDTO } from './dto/inventory.dto';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { InventoryInputDTO } from './dto/inventory.input.dto';
import { InventoryResolver } from './inventory.resolver';
import { InventoryUpdateDTO } from './dto/inventory.update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OgmaModule } from '@ogma/nestjs-module';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([InventoryEntity])],
      resolvers: [
        {
          DTOClass: InventoryDTO,
          EntityClass: InventoryEntity,
          CreateDTOClass: InventoryInputDTO,
          UpdateDTOClass: InventoryUpdateDTO,
          create: { disabled: true },
          guards: [JwtAuthGuard],
        },
      ],
    }),
    OgmaModule.forFeatures([InventoryService, InventoryResolver]),
    RestaurantModule,
  ],
  providers: [InventoryService, InventoryResolver, InventoryEntity],
  exports: [InventoryEntity, InventoryService],
})
export class InventoryModule {}
