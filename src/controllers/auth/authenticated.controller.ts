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

import User from "@src/models/user.model";
import { getUserId } from "@src/utils/authentication";
import { catchErrorToResponse } from "@src/utils/http";
import { Request, Response } from "express";

export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const foundUser = await User.findByPk(getUserId(req));

    if (!foundUser)
      res
        .status(401)
        .json({ message: "Unauthenticated User, User not found." });

    res.status(200).json({
      account: {
        id: foundUser?.id,
        email: foundUser?.email,
        name: foundUser?.name,
        description: foundUser?.description,
        photoUrl: foundUser?.photoUrl
          ? `${req.protocol}://${req.get("host")}${foundUser?.photoUrl}`
          : "",
      },
    });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const uploadProfile = async (req: Request, res: Response) => {
  try {
    const foundUser = await User.findByPk(getUserId(req));
    // Create or update the user's profile with the uploaded image URL
    const imageUrl = `/uploads/${req.file?.filename}`;
    // Find or create is good one.

    // @ts-ignore
    foundUser.photoUrl = imageUrl;

    // @ts-ignore
    await foundUser.save();

    res.status(200).json({ message: "Profile image uploaded.", foundUser });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const updateDescription = async (req: Request, res: Response) => {
  try {
    const foundUser = await User.findByPk(getUserId(req));
    // @ts-ignore
    foundUser.description = req.body.description;

    // @ts-ignore
    await foundUser.save();

    res.status(200).json({ message: "Profile image uploaded.", foundUser });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};
