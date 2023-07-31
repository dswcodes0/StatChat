import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const UserGame = sequelize.define(
  "UserGame",
  {
    Gamertag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    GameName: {
      type: DataTypes.STRING,
      allowNull: false,
      //user can only have one account per game:
      unique: true,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["Gamertag", "GameName", "Platform"],
      },
    ],
  }
);
