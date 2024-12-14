/**
 * one to many relationship example
 */

import { DataTypes, Model } from "sequelize";
import sequelize from "@src/config/database";
import User from "@src/models/user.model";

class Post extends Model {
    public id!: string;
    public title!: string;
    public content!: string;
    public userId!: string;
}

Post.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Automatically generates a UUID
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "posts",
    },
)

// Associate Post with User
User.hasMany(Post, {
    foreignKey: "userId",
    as: "posts",
  });
  Post.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });
  
  export default Post;