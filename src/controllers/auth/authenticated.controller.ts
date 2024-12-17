import User from "@src/models/user.model";
import { Request, Response } from "express";

export const getAuthenticatedUser =  async (req: Request, res: Response) => {
    const userCookie = (req as any).user;

    try {
        const foundUser = await User.findOne({ where: { email: userCookie.username } });

        if (!foundUser) res.status(401).json({ message: "Unauthenticated User, User not found." });

        res.status(200).json({ account: {
            id: foundUser?.id,
            email: foundUser?.email,
            name: foundUser?.name,
        }})
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message })
    }
}
