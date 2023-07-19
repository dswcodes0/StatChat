import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

export const Stats = sequelize.define('Stats', {
  Kills: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Deaths: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Wins: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Losses: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});