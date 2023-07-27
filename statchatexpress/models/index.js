import { User } from "./user.js";
import { Game } from "./game.js";
import { UserGame } from "./userGame.js";

User.belongsToMany(Game, { through: UserGame });

export { User, Game, UserGame };
