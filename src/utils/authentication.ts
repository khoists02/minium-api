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

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response, Request } from "express";

const JWT_ACCESS_TOKEN_SECRET = "22-07-1993"; // Replace with a strong, secure key in production
const JWT_REFRESH_TOKEN_SECRET = "07-12-1993"; // Replace with a strong, secure key in production

export const hashPassword = async (password: string) => {
    // Generate a salt and hash the password
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error("Hash password error.")
    }
}

export const isValidPassword = async (password: string, encrypted: string) => {
    // Compare the hashed password with the entered password
    return await bcrypt.compare(password, encrypted)
}

export const generateAccessToken = (payload: object, expiresIn: string = "15m"): string => {
    return jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, { expiresIn });
};

export const generateRefreshToken = (payload: object, expiresIn: string = "1h"): string => {
    return jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, { expiresIn });
};

export const verifyAccessToken = (token: string): object | string => {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string): object | string => {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
};

// Function to set token in a cookie
export const setAccessTokenCookie = (res: Response, token: string) => {
    // Set cookie with HTTPOnly and Secure flags
    res.cookie("token", token, {
        httpOnly: true, // Prevent JavaScript access
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 86400000, // 1 d
    });
};

// Function to set token in a cookie
export const setRefreshTokenCookie = (res: Response, token: string) => {
    // Set cookie with HTTPOnly and Secure flags
    res.cookie("refresh.token", token, {
        httpOnly: true, // Prevent JavaScript access
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict", // Prevent CSRF attacks
        maxAge: 86400000, // 1 d
    });
};

export const getUserId = (req: Request) => (req as any)?.user?.id;