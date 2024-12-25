import User from "@src/models/user.model";
import { Request, Response } from "express";
import {
    isValidPassword,
    generateAccessToken,
    hashPassword,
    setAccessTokenCookie,
    generateRefreshToken,
    setRefreshTokenCookie,
    verifyRefreshToken
} from "@src/utils/authentication";
import { UniqueConstraintError } from "sequelize";
import Profile from "@src/models/profile.model";

export const register = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const decrypted = await hashPassword(body.password);
        const user = await User.create({ ...body, password: decrypted });

        if (user) {
            await Profile.create({ userId: user?.id, bio: "" });
        }
        res.status(201).json({ username: user.name })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const foundUser = await User.findOne({ where: { email: body.email } });

        if (!foundUser) {
            res.status(401).json({ message: "User not found." });
        }
        const validPassword = await isValidPassword(body.password, foundUser?.password || "");
        if (!validPassword) {
            res.status(401).json({ message: "Invalid Credentials." });
        }


        const accessToken = generateAccessToken({ id: foundUser?.id, username: foundUser?.email });
        const refreshToken = generateRefreshToken({ id: foundUser?.id, username: foundUser?.email })
        // TODO: set cookies to every request headers.
        setAccessTokenCookie(res, accessToken);
        setRefreshTokenCookie(res, refreshToken);
        res.status(200).json({ token: accessToken })

    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(400).json({ message: (error as UniqueConstraintError).message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const refreshTokenCall = async (req: Request, res: Response) => {
    console.log("refreshToken starting ....");
    try {
        const refreshToken = req.cookies["refresh.token"]; // Extract token from cookies
        if (!refreshToken) res.status(401).json({ message: "Unauthenticated" });

        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded) res.status(401).json({ message: "Unauthenticated" });

        const foundUser = await User.findByPk((decoded as any).id);

        if (foundUser) {
            const newToken = generateAccessToken(foundUser);
            setAccessTokenCookie(res, newToken);
            res.status(200).json({ message: "Update token success !!!" });
        } else {
            res.status(400).json({ message: "Bad request !!!" });
        }

    } catch (error) {
        res.status(401).json({
            message: (error as any)?.message || "Internal server error",
            code: 1000,
        })
    }
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.clearCookie("refresh.token");
    res.json({ message: 'Logged out successfully' });
}