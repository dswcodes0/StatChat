import 'dotenv/config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('statchat', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres'
});
