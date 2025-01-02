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

/**
 * one to many relationship example, ONE USER - MANY POST. ONE POST => 1 USER.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@src/config/database";
import User from "@src/models/user.model";
import Channel from "./channels.model";

// Define Post attributes
interface PostAttributes {
  id: string;
  title: string;
  content: string;
  description?: string;
  backgroundUrl?: string;
  userId: string; // Foreign key to User,
  draft?: boolean;
  countLikes?: number;
  countComments?: number;
  channelId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
}

interface PostCreationAttributes extends Optional<PostAttributes, "id"> {}

class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: string;
  public title!: string;
  public content!: string;
  public description!: string;
  public backgroundUrl!: string;
  public draft!: boolean;
  public countLikes!: number;
  public countComments!: number;
  public userId!: string;
  public channelId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public publishedAt!: Date;
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
      field: "user_id",
      allowNull: false,
    },
    channelId: {
      type: DataTypes.UUID,
      field: "channel_id",
      allowNull: true,
    },
    draft: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    countLikes: {
      type: DataTypes.NUMBER,
      allowNull: true,
      defaultValue: 0,
      field: "count_likes",
    },
    countComments: {
      type: DataTypes.NUMBER,
      allowNull: true,
      defaultValue: 0,
      field: "count_comments",
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
    publishedAt: {
      type: DataTypes.DATE,
      field: "published_at", // Map to `updated_at` in the database,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "posts",
    timestamps: true,
  },
);

// Associate Post with User
User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
});

Post.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Post.belongsTo(Channel, {
  foreignKey: "channelId",
  as: "channel",
});

Channel.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
});

export default Post;
