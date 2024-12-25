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

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@src/utils/authentication";
import { TokenExpiredError } from "jsonwebtoken";

// Middleware to validate JWT from cookies
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token; // Extract token from cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided", code: 1000 });
  }

  try {
    const decoded = verifyAccessToken(token);
    (req as any).user = decoded; // Attach decoded payload to request
    next();
  } catch (err) {
    const tokenError = err as TokenExpiredError;

    const expiredTime = tokenError?.expiredAt ? new Date(tokenError?.expiredAt) : null;

    if (expiredTime && (expiredTime.getTime() < new Date().getTime())) {
      return res.status(401).json({ message: "Unauthorized: Expired token", code: 1007 });
    } else {
      return res.status(401).json({ message: "Unauthorized: Invalid token", code: 1000 });
    }

  }
};