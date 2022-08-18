import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  password: string;
  username: string;
  database: string;
}

export default registerAs('database', () => ({
  host: process.env.DATABSE_HOST,
  port: process.env.PORT,
  password: process.env.DATABASE_PASSWORD,
  username: process.env.USER,
  database: process.env.FLEA_MARKET,
}));
