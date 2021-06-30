import env from './env.conf';
import { InventoryEntity } from '../inventory/inventory.entity';

export default {
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5459,
  username: process.env.DB_USER || 'wisely',
  password: process.env.DB_PASSWORD || 'wisely123',
  database: process.env.DB_NAME || 'wisely',
  synchronize: process.env.NODE_ENV === 'develop',
  logging: env.isDevelopment,
};
