import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('statchat', 'dswcodes', 'Samuel420', {
  host: 'localhost',
  dialect: 'postgres'
});