import User from "@src/models/user.model";
import { Request, Response } from "express";
import { isValidPassword, generateToken, hashPassword, setTokenCookie } from "@src/utils/authentication";
import { UniqueConstraintError } from "sequelize";

export const register = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const decrypted = await hashPassword(body.password);
        const user = await User.create({...body, password: decrypted});
        res.status(201).json({ username: user.name })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const login =  async (req: Request, res: Response) => {
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


        const token = generateToken({ id: foundUser?.id, username: foundUser?.email });
        // TODO: set cookies to every request headers.
        setTokenCookie(res, token);
        res.status(200).json({ token })

    } catch (error) {
        console.error((error as UniqueConstraintError)?.message);

        if (error instanceof UniqueConstraintError) {
            res.status(400).json({ message: (error as UniqueConstraintError).message });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
}