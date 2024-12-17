import User from "@src/models/user.model";
import { Request, Response } from "express";
import { isValidPassword, generateToken } from "@src/utils/authentication";

export const register = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const user = await User.create(body);
        res.status(2021).json({ username: user.name })
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

        res.status(200).json({ token })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}