import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@src/utils/authentication";

// Middleware to protect routes
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access token is missing" });
    }

    try {
        const user = verifyToken(token);
        (req as any).user = user; // Attach user info to request object
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};