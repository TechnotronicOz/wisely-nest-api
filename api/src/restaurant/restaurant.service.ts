import { Injectable } from '@nestjs/common';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantService extends TypeOrmQueryService<RestaurantEntity> {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepo: Repository<RestaurantEntity>,
  ) {
    super(restaurantRepo);
  }
}
