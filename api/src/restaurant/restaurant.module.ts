import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantDTO } from './dto/restaurant.dto';
import { RestaurantInputDTO } from './dto/restaurant.input.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([RestaurantEntity])],
      resolvers: [
        {
          DTOClass: RestaurantDTO,
          EntityClass: RestaurantEntity,
          CreateDTOClass: RestaurantInputDTO,
          UpdateDTOClass: RestaurantInputDTO,
        },
      ],
    }),
  ],
  providers: [RestaurantService, RestaurantEntity],
  exports: [RestaurantEntity, RestaurantService],
})
export class RestaurantModule {}
