import User from "@src/models/user.model";
import { IUserResponse } from "@src/types/user";

export const convertUserToResponse = (user: User): IUserResponse => {
    return {
        id: user?.id,
        email: user?.email,
        name: user?.name,
    }
}