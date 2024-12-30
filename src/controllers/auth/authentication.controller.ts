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
import { Request, Response } from "express";
import {
  isValidPassword,
  generateAccessToken,
  hashPassword,
  setAccessTokenCookie,
  generateRefreshToken,
  setRefreshTokenCookie,
  verifyRefreshToken,
} from "@src/utils/authentication";

export const register = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const decrypted = await hashPassword(body.password);
    const user = await User.create({ ...body, password: decrypted });

    res.status(201).json({ username: user.name });
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as any)?.message || "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const foundUser = await User.findOne({ where: { email: body.email } });

    if (!foundUser) {
      res.status(401).json({ message: "User not found." });
    }
    const validPassword = await isValidPassword(
      body.password,
      foundUser?.password || "",
    );
    if (!validPassword) {
      res.status(401).json({ message: "Invalid Credentials." });
    }

    const accessToken = generateAccessToken({
      id: foundUser?.id,
      username: foundUser?.email,
    });
    const refreshToken = generateRefreshToken({
      id: foundUser?.id,
      username: foundUser?.email,
    });
    // TODO: set cookies to every request headers.
    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);
    res.status(200).json({ token: accessToken });
  } catch (error) {
    // if (error instanceof UniqueConstraintError) {
    //     res.status(400).json({ message: (error as UniqueConstraintError).message });
    // }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const refreshTokenCall = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies["refresh.token"]; // Extract token from cookies
    if (!refreshToken) res.status(401).json({ message: "Unauthenticated" });

    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) res.status(401).json({ message: "Unauthenticated" });

    const foundUser = await User.findByPk((decoded as any).id);

    if (foundUser) {
      const newToken = generateAccessToken({
        id: foundUser?.id,
        username: foundUser?.email,
      });
      setAccessTokenCookie(res, newToken);
      res.status(200).json({ message: "Update token success !!!" });
    } else {
      res.status(400).json({ message: "Bad request !!!" });
    }
  } catch (error) {
    console.log("refreshTokenCall", { error });
    res.status(401).json({
      message: (error as any)?.message || "Internal server error",
      code: 1000,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.clearCookie("refresh.token");
  res.json({ message: "Logged out successfully" });
};
