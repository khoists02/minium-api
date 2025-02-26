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

import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import sequelize from "@src/config/database";
import User from "@src/models/user.model";
import Post from "@src/models/post.model";

interface CommentAttributes {
  id: string;
  title: string;
  content: string;
  userId: string;
  postId: string;
  countLikes?: number;
  countReplies?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentCreationAttributes extends Optional<CommentAttributes, "id"> {}

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: string;
  public title!: string;
  public content!: string;
  public userId!: string;
  public postId!: string;
  public countLikes!: number;
  public countReplies!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Comment.init(
  {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    title: { type: DataTypes.TEXT, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
    postId: { type: DataTypes.UUID, allowNull: false, field: "post_id" },
    countLikes: {
      type: DataTypes.NUMBER,
      allowNull: true,
      defaultValue: 0,
      field: "count_likes",
    },
    countReplies: {
      type: DataTypes.NUMBER,
      allowNull: true,
      defaultValue: 0,
      field: "count_replies",
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
    tableName: "comments",
    timestamps: true,
  },
);

// Associations
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });

Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });
Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });

export default Comment;
