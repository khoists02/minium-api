import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@src/utils/authentication";

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
    console.log("validateToken", { err });
    return res.status(401).json({ message: "Unauthorized: Invalid token", code: 1000 });
  }
};