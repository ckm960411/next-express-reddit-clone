import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USER_ID,
  database: process.env.DB_USER_ID,
  password: process.env.DB_USER_PASSWORD,
  synchronize: true, // 개발환경에서만 true, 제품에선 false
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: [],
  subscribers: [],
});
