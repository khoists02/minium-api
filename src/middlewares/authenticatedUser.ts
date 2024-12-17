import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@src/utils/authentication";

// Middleware to validate JWT from cookies
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token; // Extract token from cookies
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
  
    try {
      const decoded = verifyToken(token);
      (req as any).user = decoded; // Attach decoded payload to request
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  };