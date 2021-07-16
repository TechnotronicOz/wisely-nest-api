import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { ReservationEntity } from './reservation.entity';
import { ReservationDTO } from './dto/reservation.dto';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { ReservationResolver } from './reservation.resolver';
import { InventoryModule } from '../inventory/inventory.module';
import { ReservationUpdateDTO } from './dto/reservation.update.dto';
import { OgmaModule } from '@ogma/nestjs-module';
import { ReservationController } from './reservation.controller';

@Module({
  imports: [
    InventoryModule,
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([ReservationEntity])],
      resolvers: [
        {
          DTOClass: ReservationDTO,
          EntityClass: ReservationEntity,
          CreateDTOClass: ReservationInputDTO,
          UpdateDTOClass: ReservationUpdateDTO,
          create: { disabled: true },
          update: { disabled: true },
        },
      ],
    }),
    OgmaModule.forFeatures([
      ReservationService,
      ReservationController,
      ReservationResolver,
    ]),
  ],
  providers: [ReservationService, ReservationResolver, ReservationEntity],
  exports: [ReservationEntity, ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
