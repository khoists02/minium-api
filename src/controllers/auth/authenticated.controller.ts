import Profile from "@src/models/profile.model";
import User from "@src/models/user.model";
import { getUserId } from "@src/utils/authentication";
import { Request, Response } from "express";
import fs from "fs";

export const getAuthenticatedUser = async (req: Request, res: Response) => {
    const userCookie = (req as any).user;

    try {
        const foundUser = await User.findByPk(userCookie?.id, {
            include: [
                {
                    model: Profile,
                    as: "profile",
                    attributes: ["id", "bio"]
                }
            ]
        });

        if (!foundUser) res.status(401).json({ message: "Unauthenticated User, User not found." });

        console.log({ foundUser })

        // foundUser.pro

        res.status(200).json({
            account: {
                id: foundUser?.id,
                email: foundUser?.email,
                name: foundUser?.name,
                // @ts-ignore
                imageUrl: foundUser ? foundUser["profile"]?.bio : ""
            }
        })
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message })
    }
}

export const uploadProfile = async (req: Request, res: Response) => {
    try {
        const foundUser = await User.findByPk(getUserId(req));
        // Create or update the user's profile with the uploaded image URL
        const imageUrl = `/uploads/${req.file?.filename}`;
        // Find or create is good one.
        const [profile] = await Profile.findOrCreate({
            where: { userId: foundUser?.id },
            defaults: { bio: imageUrl },
        });
        if (!profile) res.status(400).json({ message: "Bad Request. Profile not found." });
        profile.bio = imageUrl;
        await profile.save();

        res.status(200).json({ message: "Profile image uploaded.", profile });

    } catch (error) {
        res.status(500).json({ message: (error as any)?.message });
    }
}