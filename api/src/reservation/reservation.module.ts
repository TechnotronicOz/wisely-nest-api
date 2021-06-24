import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { ReservationEntity } from './reservation.entity';
import { ReservationDTO } from './dto/reservation.dto';
import { ReservationInputDTO } from './dto/reservation.input.dto';
import { ReservationResolver } from './reservation.resolver';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([ReservationEntity])],
      resolvers: [
        {
          DTOClass: ReservationDTO,
          EntityClass: ReservationEntity,
          CreateDTOClass: ReservationInputDTO,
          UpdateDTOClass: ReservationInputDTO,
          create: { disabled: true },
          update: { disabled: true },
        },
      ],
    }),
  ],
  providers: [ReservationService, ReservationResolver],
  exports: [ReservationEntity, ReservationService],
})
export class ReservationModule {}
