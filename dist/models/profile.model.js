"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("@src/config/database"));
const user_model_1 = __importDefault(require("@src/models/user.model"));
/**
 * One to One relationship with user.model
 */
class Profile extends sequelize_1.Model {
}
Profile.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4, // Automatically generates a UUID
        primaryKey: true,
    },
    bio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: "profiles",
});
// Associate Profile with User
user_model_1.default.hasOne(Profile, {
    foreignKey: "userId",
    as: "profile",
});
Profile.belongsTo(user_model_1.default, {
    foreignKey: "userId",
    as: "user",
});
exports.default = Profile;
