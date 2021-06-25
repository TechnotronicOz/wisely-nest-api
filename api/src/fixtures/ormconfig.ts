import { ConnectionOptions } from 'typeorm';
import { ReservationEntity } from '../reservation/reservation.entity';
import { InventoryEntity } from '../inventory/inventory.entity';

export const config: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  host: process.env.WISE_HOST || 'localhost',
  port: +process.env.WISE_PORT || 5459,
  username: process.env.WISE_USER || 'wisely',
  password: process.env.WISE_PW || 'wisely123',
  database: 'wisely',
  logger: 'simple-console',
  synchronize: false,
  entities: [
    './dist/inventory/inventory.entity.js',
    './dist/reservation/reservation.entity.js',
    './dist/restaurant/restaurant.entity.js',
  ],
} as ConnectionOptions;
