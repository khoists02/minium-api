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
import Post from "./post.model";

type PostFavoriteAttributes = {
  id: string;
  postId: string;
  userId: string;
};

export type PostFavoriteResponse = Partial<PostFavoriteAttributes>;

interface PostFavoriteCreationAttributes
  extends Optional<PostFavoriteAttributes, "id"> {}

class PostFavorite
  extends Model<PostFavoriteAttributes, PostFavoriteCreationAttributes>
  implements PostFavoriteAttributes
{
  public id!: string;
  public postId!: string;
  public userId!: string;
}

PostFavorite.init(
  {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    postId: { type: DataTypes.UUID, allowNull: false, field: "post_id" },
    userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
  },
  {
    sequelize,
    tableName: "post_favorite",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "post_id"],
      },
    ],
  },
);

// Associations
Post.hasOne(PostFavorite, {
  foreignKey: "postId",
  as: "favorite",
  onDelete: "CASCADE", // Automatically delete PostFavorite when Post is deleted
});

export default PostFavorite;
