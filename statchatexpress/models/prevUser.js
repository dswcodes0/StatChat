import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const PrevUser = sequelize.define("PrevUser", {
  gamertag: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default PrevUser;
