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

import { Request, Response } from "express";
import User from "@src/models/user.model";
import { getPaginationFromRequest } from "@src/helpers/pagination";
import { PaginatedResponse } from "@src/types/pagination";
import { IUserResponse } from "@src/types/user";
import { convertToUserResponse } from "@src/utils/convert";

export const getUsers = async (req: Request, res: Response) => {
  // Fetch the total number of users
  const totalItems = await User.count();

  const { skip, limit, totalPages, page } = getPaginationFromRequest(
    req,
    totalItems,
  );

  const users = await User.findAll({
    offset: skip,
    limit: limit,
  });

  // Prepare paginated response
  const response: PaginatedResponse<IUserResponse[]> = {
    content: users.map((u) => convertToUserResponse(u)),
    totalItems,
    totalPages,
    currentPage: page,
    pageSize: limit,
  };
  res.json(response);
};
