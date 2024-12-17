import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response, Request } from "express";

const JWT_SECRET = "22-07-1993"; // Replace with a strong, secure key in production

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

export const generateToken = (payload: object, expiresIn: string = "1h"): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): object | string => {
    return jwt.verify(token, JWT_SECRET);
};

// Function to set token in a cookie
export const setTokenCookie = (res: Response, token: string) => {
    // Set cookie with HTTPOnly and Secure flags
    res.cookie('token', token, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 3600000, // 1 hour
    });
  };

  export const getUserId = (req: Request) => (req as any)?.user?.id;