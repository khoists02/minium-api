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

// -- Table: follows.
import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import sequelize from "@src/config/database";
import User from "./user.model";

export enum FollowType {
  USER = "USER",
  CHANNEL = "CHANNEL",
}

interface FollowAttributes {
  id: string;
  type: FollowType;
  followerId?: string | null;
  userId: string;
}

interface FollowCreationAttributes extends Optional<FollowAttributes, "id"> {}

class Follow
  extends Model<FollowCreationAttributes, FollowCreationAttributes>
  implements FollowCreationAttributes
{
  public id!: string;
  public type!: FollowType;
  public userId!: string;
  public followerId!: string;
}

Follow.init(
  {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    type: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false, field: "user_id" },
    followerId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "follower_id",
    },
  },
  {
    sequelize,
    tableName: "follows",
    timestamps: false,
  },
);

// Associations
Follow.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Follow, { foreignKey: "userId", as: "channel" });

export default Follow;
