import env from './env.conf';
import { InventoryEntity } from '../inventory/inventory.entity';
import { ReservationEntity } from '../reservation/reservation.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { UserEntity } from '../users/user.entity';

export default {
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5459,
  username: process.env.DB_USER || 'wisely',
  password: process.env.DB_PASSWORD || 'wisely123',
  database: process.env.DB_NAME || 'wisely',
  synchronize: env.isDevelopment,
  entities: [InventoryEntity, ReservationEntity, RestaurantEntity, UserEntity],
  logging: env.isDevelopment,
  engine: {
    reportSchema: process.env.APOLLO_REPORT_SCHEMA || true,
    apolloKey: process.env.APOLLO_KEY || '',
    graphVariant: '',
    isEnabled: process.env.APOLLO_ENABLED || true,
  },
};
