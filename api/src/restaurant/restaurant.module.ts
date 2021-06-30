import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantDTO } from './dto/restaurant.dto';
import { RestaurantInputDTO } from './dto/restaurant.input.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
          guards: [JwtAuthGuard],
        },
      ],
    }),
  ],
  providers: [RestaurantService, RestaurantEntity],
  exports: [RestaurantEntity, RestaurantService],
})
export class RestaurantModule {}
