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

import { Request } from "express";
import { Model } from "sequelize";

// Helper function to calculate pagination
export const calculatePagination = (
  page: number,
  limit: number,
  totalItems: number
): { skip: number; totalPages: number } => {
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalItems / limit);

  return { skip, totalPages };
};


export const getPaginationFromRequest = (req: Request, totalItems: number) => {
  const page = parseInt(req.query.page as string) || 1; // default to page 1
  const limit = parseInt(req.query.limit as string) || 10; // default to limit 10

  // Calculate pagination from helper function
  const { skip, totalPages } = calculatePagination(page, limit, totalItems);
  return { skip, totalPages, limit, page };
}