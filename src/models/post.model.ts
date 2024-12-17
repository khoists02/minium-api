/**
 * one to many relationship example, ONE USER - MANY POST. ONE POST => 1 USER.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@src/config/database";
import User from "@src/models/user.model";

// Define Post attributes
interface PostAttributes {
    id: string;
    title: string;
    content: string;
    userId: string; // Foreign key to User
}
  
interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
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
            type: DataTypes.UUID,
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