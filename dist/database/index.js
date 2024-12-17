"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = exports.sequelize = void 0;
/**
 * Init Database schemas.
 */
const database_1 = __importDefault(require("@src/config/database"));
exports.sequelize = database_1.default;
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
        await database_1.default.authenticate();
        console.log("Database connected!");
        await database_1.default.sync({ alter: true }); // Sync models with the database
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
exports.initDb = initDb;
