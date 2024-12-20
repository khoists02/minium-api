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
    description?: string;
    backgroundUrl?: string;
    userId: string; // Foreign key to User
    createdAt?: Date;
    updatedAt?: Date;
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> { }

class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
    public id!: string;
    public title!: string;
    public content!: string;
    public description!: string;
    public backgroundUrl!: string;
    public userId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
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
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        backgroundUrl: {
            type: DataTypes.STRING,
            field: "background_url",
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        // Map Sequelize's default timestamp fields to custom column names
        createdAt: {
            type: DataTypes.DATE,
            field: "created_at", // Map to `created_at` in the database,
            defaultValue: Date.now()
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: "updated_at", // Map to `updated_at` in the database,
            defaultValue: Date.now()
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