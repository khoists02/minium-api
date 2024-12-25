/**
 * Init Database schemas.
 */
import sequelize from "@src/config/database";
// TODO: We use the flyway instead init new models.
// import User from "@src/models/user.model";
// import Profile from "@src/models/profile.model";
// import Post from "@src/models/post.model";
// import UserGroup from "@src/models/user-group.model";
/**
 * Should exports entities to here to init new object model postgres.
 */
const initDb = async () => {
  try {
    console.log("Starting init db...");
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync({ alter: false }); // Sync models with the database, true will be automatic sync new modes in db
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize, initDb };