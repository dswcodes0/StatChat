import { User } from "./user.js";
import { UserGame } from "./userGame.js";

User.hasMany(UserGame);
UserGame.belongsTo(User, { as: "user", foreignKey: "UserId" });

export { User, UserGame };
