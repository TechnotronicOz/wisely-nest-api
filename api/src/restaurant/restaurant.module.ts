import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantDTO } from './dto/restaurant.dto';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([RestaurantEntity])],
      resolvers: [
        {
          DTOClass: RestaurantDTO,
          EntityClass: RestaurantEntity,
        },
      ],
    }),
  ],
  providers: [RestaurantService, RestaurantEntity],
  controllers: [RestaurantController],
  exports: [RestaurantEntity, RestaurantService],
})
export class RestaurantModule {}
