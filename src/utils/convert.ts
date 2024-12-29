import { IUserResponse } from "@src/data/user";
import User from "@src/models/user.model";

export const convertToUserResponse = (user: User): IUserResponse => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photoUrl: user.photoUrl,
    description: user.description,
  };
};
