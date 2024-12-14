import sequelize from "@src/config/database";
import User from "@src/models/user.model";
import Profile from "@src/models/profile.model";
/**
 * Should exports entities to here to init new object model postgres.
 */
declare const initDb: () => Promise<void>;
export { sequelize, initDb, User, Profile };
