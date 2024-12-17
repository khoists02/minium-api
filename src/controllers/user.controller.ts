import { Request, Response } from "express";
import User from "@src/models/user.model";

export const getUsers = async (req: Request, res: Response) => {
    const users = await User.findAll();
    res.json({ users });
};

export const createUsers = async (req: Request, res: Response) => {
    // const users = await User.findAll();
    res.json({ userName: "khoi.le" });
};