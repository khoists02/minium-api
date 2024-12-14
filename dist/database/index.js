import sequelize from "@src/config/database";
import User from "@src/models/user.model";
import Profile from "@src/models/profile.model";
/**
 * Should exports entities to here to init new object model postgres.
 */
const initDb = async () => {
    try {
        console.log("Starting init db...");
        await sequelize.authenticate();
        console.log("Database connected!");
        await sequelize.sync({ alter: true }); // Sync models with the database
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
export { sequelize, initDb, User, Profile };
