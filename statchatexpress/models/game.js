import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Game = sequelize.define("Game", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});
