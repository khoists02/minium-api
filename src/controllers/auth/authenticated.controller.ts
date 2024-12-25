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

import Profile from "@src/models/profile.model";
import User from "@src/models/user.model";
import { getUserId } from "@src/utils/authentication";
import { Request, Response } from "express";

export const getAuthenticatedUser = async (req: Request, res: Response) => {
    const userCookie = (req as any).user;

    try {
        const foundUser = await User.findByPk(userCookie?.id);

        if (!foundUser) res.status(401).json({ message: "Unauthenticated User, User not found." });

        res.status(200).json({
            account: {
                id: foundUser?.id,
                email: foundUser?.email,
                name: foundUser?.name,
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