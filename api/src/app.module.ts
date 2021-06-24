import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { InventoryModule } from './inventory/inventory.module';
import { ReservationModule } from './reservation/reservation.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { InventoryEntity } from './inventory/inventory.entity';
import { ReservationEntity } from './reservation/reservation.entity';
import { RestaurantEntity } from './restaurant/restaurant.entity';
import { CommonModule } from './common/common.module';
import dbConf from './config/db-conn';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...dbConf,
      entities: [InventoryEntity, ReservationEntity, RestaurantEntity],
      synchronize: true,
      logging: true,
      // autoLoadEntities: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    InventoryModule,
    ReservationModule,
    RestaurantModule,
    CommonModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
