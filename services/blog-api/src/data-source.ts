import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.ADMIN_DB_HOST || 'localhost',
  port: parseInt(process.env.ADMIN_DB_PORT || '5432', 10),
  username: process.env.ADMIN_DB_USERNAME || 'pritesh',
  password: process.env.ADMIN_DB_PASSWORD || 'pritesh',
  database: process.env.ADMIN_DB_DATABASE || 'db_name',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});

