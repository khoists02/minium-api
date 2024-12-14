/**
 * one to many relationship example
 */

import { DataTypes, Model } from "sequelize";
import sequelize from "@src/config/database";
import User from "@src/models/user.model";

class Post extends Model {
    public id!: number;
    public title!: string;
    public content!: string;
    public userId!: number;
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
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