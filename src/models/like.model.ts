import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@src/config/database";
import Post from "./post.model";

interface LikesAttributes {
  id: string;
  userId: string;
  postId: string;
  createdAt?: Date;
}

interface LikesCreationAttributes extends Optional<LikesAttributes, "id"> { }

class Likes extends Model<LikesAttributes, LikesCreationAttributes> implements LikesAttributes {
  public id!: string;
  public userId!: string;
  public postId!: string;
  public createdAt!: Date;
}

Likes.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.UUID,
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
  },
  {
    sequelize,
    tableName: "likes",
    indexes: [
      {
        unique: true,
        fields: ["postId", "userId"]
      }
    ]
  },
);

// Associations
Post.hasMany(Likes, { foreignKey: "postId", onDelete: "CASCADE" });
Likes.belongsTo(Post, { foreignKey: "postId" });

export default Likes;
