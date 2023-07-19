import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('Statchat', 'dswcodes', 'Samuel420', {
  host: 'localhost',
  dialect: 'postgres'
});