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
import Comment from "./comment.model";
import User from "./user.model";

interface CommentReplyAttributes {
  id: string;
  commentId: string;
  content: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentReplyCreationAttributes
  extends Optional<CommentReplyAttributes, "id"> {}

class CommentReply
  extends Model<CommentReplyAttributes, CommentReplyCreationAttributes>
  implements CommentReplyAttributes
{
  public id!: string;
  public content!: string;
  public commentId!: string;
  public userId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

CommentReply.init(
  {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    commentId: { type: DataTypes.UUID, allowNull: false, field: "comment_id" },
    userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
    content: { type: DataTypes.TEXT, allowNull: false },
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
    tableName: "comment_replies",
  },
);

// Associations
Comment.hasMany(CommentReply, { foreignKey: "commentId", onDelete: "CASCADE" });
CommentReply.belongsTo(Comment, { foreignKey: "commentId" });

CommentReply.belongsTo(User, { foreignKey: "userId", as: "user" });

export default CommentReply;
