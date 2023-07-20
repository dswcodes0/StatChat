import { User } from "./user.js";
import { Stats } from "./stats.js";

User.hasMany(Stats, { as: "stats", foreignKey: "userId" });
Stats.belongsTo(User, { as: "user", foreignKey: "userId" });

export { User, Stats };
