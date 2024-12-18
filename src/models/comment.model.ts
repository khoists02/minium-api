import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import sequelize from "@src/config/database";
import User from "@src/models/user.model"; 
import Post from "@src/models/post.model";

/**
 * Database Relationships
	1.	A User can have multiple Posts (One-to-Many).
	2.	A User can have multiple Comments (One-to-Many).
	3.	A Post can have multiple Comments (One-to-Many).
	4.	Each Comment belongs to a User and a Post.
 */

interface CommentAttributes {
    id: string;
    content: string;
    userId: string;
    postId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, "id"> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public id!: string;
    public content!: string;
    public userId!: string;
    public postId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Comment.init(
    {
      id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
      content: { type: DataTypes.TEXT, allowNull: false },
      userId: { type: DataTypes.UUID, allowNull: false },
      postId: { type: DataTypes.UUID, allowNull: false },
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
      tableName: "comments",
    }
);

// Associations
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });

Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });

export default Comment;
