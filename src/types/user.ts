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

import { ChannelResponse } from "@src/models/channels.model";

export interface IUserResponse {
  id?: string;
  name?: string;
  email?: string;
  updatedAt?: Date | string;
}

export interface IPostResponse {
  id?: string;
  title?: string;
  content?: string;
  description?: string;
  backgroundUrl?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  countLikes?: number;
  countComments?: number;
  userId?: string;
  user?: IUserResponse;
  channel?: ChannelResponse;
  publishedAt?: Date | string;
  isFavorite?: boolean;
}

export interface IPublicPostResponse {
  id?: string;
  title?: string;
  content?: string;
  description?: string;
  backgroundUrl?: string;
  updatedAt?: Date | string;
  countLikes?: number;
  countComments?: number;
  isFavorite?: boolean;
}

export interface ICommentResponse {
  id?: string;
  title?: string;
  content?: string;
  author?: IUserResponse;
  lastUpdatedAt?: Date | string;
  countLikes?: number;
  countReplies?: number;
  visibleLike?: boolean;
}
