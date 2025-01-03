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

interface CommentLikesAttributes {
  id: string;
  commentId: string;
  postId: string;
  userId: string;
}

interface CommentLikesCreationAttributes
  extends Optional<CommentLikesAttributes, "id"> {}

class CommentLikes
  extends Model<CommentLikesAttributes, CommentLikesCreationAttributes>
  implements CommentLikesAttributes
{
  public id!: string;
  public userId!: string;
  public postId!: string;
  public commentId!: string;
}

CommentLikes.init(
  {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
    commentId: { type: DataTypes.UUID, allowNull: false, field: "comment_id" },
    postId: { type: DataTypes.UUID, allowNull: false, field: "post_id" },
  },
  {
    sequelize,
    tableName: "comment_likes",
    timestamps: false,
  },
);

// Associations
Comment.hasMany(CommentLikes, { foreignKey: "commentId", onDelete: "CASCADE" });
CommentLikes.belongsTo(Comment, { foreignKey: "commentId" });

export default CommentLikes;
