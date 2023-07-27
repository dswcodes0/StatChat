import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { Game } from "./game.js";
import { UserGame } from "./userGame.js";

export const User = sequelize.define("User", {
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Gamertag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Platform: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.belongsToMany(Game, { through: UserGame });

export default User;
