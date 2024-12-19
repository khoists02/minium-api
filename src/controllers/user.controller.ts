import { Request, Response } from "express";
import User from "@src/models/user.model";
import { convertUserToResponse } from "@src/helpers/users/user.helper";
import { getPaginationFromRequest } from "@src/helpers/pagination";
import { PaginatedResponse } from "@src/types/pagination";
import { IUserResponse } from "@src/types/user";

export const getUsers = async (req: Request, res: Response) => {
      // Fetch the total number of users
    const totalItems = await User.count();

    const { skip, limit, totalPages, page } = getPaginationFromRequest(req, totalItems); 

    const users = await User.findAll({
        offset: skip,
        limit: limit,
      });

     // Prepare paginated response
    const response: PaginatedResponse<IUserResponse[]> = {
        content: users.map((u) => convertUserToResponse(u)),
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
    };
    res.json(response);
};
