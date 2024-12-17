import { Request, Response } from "express";
import User from "@src/models/user.model";
import { convertUserToResponse } from "@src/helpers/users/user.helper";
import { calculatePagination } from "@src/helpers/pagination";
import { PaginatedResponse } from "@src/types/pagination";
import { IUserResponse } from "@src/types/user";

export const getUsers = async (req: Request, res: Response) => {
     // Get query params
     const page = parseInt(req.query.page as string) || 1; // default to page 1
     const limit = parseInt(req.query.limit as string) || 10; // default to limit 10

      // Fetch the total number of users
    const totalItems = await User.count();

    // Calculate pagination from helper function
    const { skip, totalPages } = calculatePagination(page, limit, totalItems);

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
