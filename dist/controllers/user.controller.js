import { User } from "@src/database/index";
export const getUsers = async (req, res) => {
    const users = await User.findAll();
    res.json({ users });
};
