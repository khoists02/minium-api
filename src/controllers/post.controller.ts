import { getPaginationFromRequest } from "@src/helpers/pagination";
import Post from "@src/models/post.model";
import User from "@src/models/user.model";
import { PaginatedResponse } from "@src/types/pagination";
import { IPostResponse } from "@src/types/user";
import { getUserId } from "@src/utils/authentication"
import { Request, Response } from "express"
import { Op } from "sequelize";

export const createPost = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);

        const foundUser = await User.findByPk(userId);

        const { title, content } = req.body;

        if (foundUser)
            await Post.create({
                title,
                content,
                userId: foundUser.id,
            });

        res.status(201).json({
            message: 'Post created successfully',
        });
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message });
    }
}

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const foundPost = await Post.findByPk(id);

        if (foundPost) {
            const { title, content } = req.body;
            foundPost.title = title;
            foundPost.content = content;
            await foundPost.save();
        }

        res.status(200).json({ message: "Updated Post" });
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message });
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const foundPost = await Post.findByPk(id);

        await foundPost?.destroy();

        res.status(200).json({ message: "Updated Post" });
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message });
    }
}

/**
 * Get all posts
 * @param req 
 * @param res 
 */
export const getAllPost = async (req: Request, res: Response) => {
    try {
        const { title } = req.query;

        const whereConditions: any = {};

        if (title) {
            whereConditions.title = { [Op.like]: `%${title}%` }; // Partial match
        }

        const totalItems = await Post.count({ where: whereConditions });

        const { skip, limit, totalPages, page } = getPaginationFromRequest(req, totalItems); 

        const allPost = await Post.findAll({
            include: [{
                model: User,
                as: "user",
                attributes: ["id"]
            }],
            where: whereConditions,
            offset: skip,
            limit: limit,
        });
        // Prepare paginated response
        const response: PaginatedResponse<IPostResponse[]> = {
            content: allPost.map((u) => {
                return {
                        id: u?.id,
                        title: u?.title,
                        content: u?.content,
                        userId: u?.userId
                    }
                }),
            totalItems,
            totalPages,
            currentPage: page,
            pageSize: limit,
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message });
    }
}
/**
 * Get Post details include user.
 * @param req 
 * @param res 
 */
export const getPostDetails = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const foundPost = await Post.findByPk(postId, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"]
                }
            ]
        });

        res.status(200).json({ post: foundPost })
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message });
    }
}

/**
 * Get all post based on for each userId
 * @param req 
 * @param res 
 */
export const getAllPostByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { title } = req.query;

        if (!userId) res.status(404).json({ message: "User not found." });

        const foundUser  = await User.findByPk(userId as string);

        if (!foundUser) res.status(404).json({ message: "User not found." });

        const whereConditions: any = {};

        if (title) {
            whereConditions.title = { [Op.like]: `%${title}%` }; // Partial match
        }

        if (userId) {
            whereConditions.userId = { [Op.eq]: userId }; // Partial match
        }

        const totalItems = await Post.count({ where: whereConditions });

        const { skip, limit, totalPages, page } = getPaginationFromRequest(req, totalItems); 

        const allPost = await Post.findAll({
            include: [{
                model: User,
                as: "user",
                attributes: ["id"]
            }],
            where: whereConditions,
            offset: skip,
            limit: limit,
        });
        // Prepare paginated response
        const response: PaginatedResponse<IPostResponse[]> = {
            content: allPost.map((u) => {
                return {
                        id: u?.id,
                        title: u?.title,
                        content: u?.content,
                        userId: u?.userId
                    }
                }),
            totalItems,
            totalPages,
            currentPage: page,
            pageSize: limit,
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message });
    }
}
