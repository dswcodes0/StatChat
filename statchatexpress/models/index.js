import { PrevUser } from "./prevUser.js";
import { User } from "./user.js";
import { UserGame } from "./userGame.js";

User.hasMany(UserGame);
User.hasMany(PrevUser);
UserGame.belongsTo(User, { as: "user", foreignKey: "UserId" });
PrevUser.belongsTo(User, { as: "prevUser", foreignKey: "prevUser" });

export { User, UserGame, PrevUser };
