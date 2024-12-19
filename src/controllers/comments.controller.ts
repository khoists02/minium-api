import Comment from "@src/models/comment.model";
import { getPaginationFromRequest } from "@src/helpers/pagination";
import Post from "@src/models/post.model";
import User from "@src/models/user.model";
import { PaginatedResponse } from "@src/types/pagination";
import { Request, Response } from "express";
import { getUserId } from "@src/utils/authentication";
import { ICommentResponse } from "@src/types/user";

//API: /posts/:postId/comments
export const createComment = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = getUserId(req);

        const foundPost = await Post.findByPk(postId);

        if (!foundPost) res.status(404).json({ message: "Post can not found." });

        const newComment = await Comment.create({
            content: req.body.content,
            userId,
            postId,
        });

        res.status(201).json({ message: `New Comment of ${foundPost?.title} is created.` });
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message || "Internal server error." });
    }
}

//PutMapping /posts/:postId/comments/:commentId
export const updateComment = async (req: Request, res: Response) => {
    try {
        const { postId, commentId } = req.params;

        const { content } = req.body;

        const foundPost = await Post.findByPk(postId);

        if (!foundPost) res.status(404).json({ message: "Post can not found." });

        const foundComment = await Comment.findByPk(commentId);

        if (foundComment) {
            foundComment.content = content;
            await foundComment.save();
            res.status(200).json({ message: "Updated Comment Successfully." });
        } else {
            res.status(404).json({ message: "Comment can not found." });
        }

    } catch (error) {
        res.status(500).json({ message: (error as any)?.message || "Internal server error." });
    }
}

//DeleteMapping /posts/:postId/comments/:commentId
export const deleteComment = async (req: Request, res: Response) => {
    try {
        const { postId, commentId } = req.params;

        const foundPost = await Post.findByPk(postId);

        if (!foundPost) res.status(404).json({ message: "Post can not found." });

        const foundComment = await Comment.findByPk(commentId);

        if (foundComment) {
            await foundComment.destroy();
            res.status(200).json({ message: "Updated Comment Successfully." });
        } else {
            res.status(404).json({ message: "Comment can not found." });
        }
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message || "Internal server error." });
    }
}

//GetMapping /posts/:postId/comments
export const getAllCommentBasedOnPost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        const totalItems = await Comment.count({ where: { postId } });

        const { skip, limit, totalPages, page } = getPaginationFromRequest(req, totalItems);


        const comments = await Comment.findAll({
            where: { postId },
            limit,
            offset: skip,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name"]
                }
            ]
        });

        // Prepare paginated response
        const response: PaginatedResponse<ICommentResponse[]> = {
            content: comments.map((cmt) => {
                return {
                    id: cmt?.id,
                    content: cmt?.content,
                    // @ts-ignore
                    user: cmt["user"]
                }
            }),
            totalItems,
            totalPages,
            currentPage: page,
            pageSize: limit,
        };
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: (error as any)?.message || "Internal server error." });
    }
}