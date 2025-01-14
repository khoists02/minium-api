/*
 * Mimium Pty. Ltd. ("LKG") CONFIDENTIAL
 * Copyright (c) 2022 Mimium project Pty. Ltd. All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of LKG. The intellectual and technical concepts contained
 * herein are proprietary to LKG and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from LKG.  Access to the source code contained herein is hereby forbidden to anyone except current LKG employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 */

import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "@src/config/database";
import Post from "./post.model";

interface LikesAttributes {
  id: string;
  userId: string;
  postId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LikesCreationAttributes extends Optional<LikesAttributes, "id"> {}

class Likes
  extends Model<LikesAttributes, LikesCreationAttributes>
  implements LikesAttributes
{
  public id!: string;
  public userId!: string;
  public postId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
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
      field: "post_id",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
    // Map Sequelize's default timestamp fields to custom column names
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at", // Map to `created_at` in the database,
      defaultValue: Date.now(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at", // Map to `updated_at` in the database,
      defaultValue: Date.now(),
    },
  },
  {
    sequelize,
    tableName: "likes",
    timestamps: true,
    // timestamps: false, // Disable both createdAt and updatedAt
  },
);

// Associations
Post.hasMany(Likes, { foreignKey: "postId", onDelete: "CASCADE" });
Likes.belongsTo(Post, { foreignKey: "postId" });

export default Likes;
