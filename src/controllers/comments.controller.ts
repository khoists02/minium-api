/*
 * Mimium Pty. Ltd. ("LKG") CONFIDENTIAL
 * Copyright (c) 2022 Mimium project Pty. Ltd. All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains the property of LKG. The intellectual and technical concepts contained
 * herein are proprietary to LKG and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material is strictly forbidden unless prior written permission is obtained
 * from LKG.  Access to the source code contained herein is hereby forbidden to anyone except current LKG employees, managers or contractors who have executed
 * Confidentiality and Non-disclosure agreements explicitly covering such access.
 */

import Comment from "@src/models/comment.model";
import { getPaginationFromRequest } from "@src/helpers/pagination";
import Post from "@src/models/post.model";
import User from "@src/models/user.model";
import { PaginatedResponse } from "@src/types/pagination";
import { Request, Response } from "express";
import { getUserId } from "@src/utils/authentication";
import { ICommentResponse } from "@src/types/user";
import { sequelize } from "@src/database";
import { convertToUserResponse } from "@src/utils/conver";

const handleCountCommentInPostTransaction = async (
  title: string,
  content: string,
  postId: string,
  userId: string,
  commentId: string,
  increase = true,
) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    const foundPost = await Post.findByPk(postId);

    if (!foundPost) {
      throw new Error("Post not found");
    }

    if (increase)
      await Comment.create({ title, content, postId, userId }, { transaction });
    else {
      const foundComment = await Comment.findOne({
        where: { postId, userId, id: commentId },
        transaction,
      });
      await foundComment?.destroy({ transaction });
    }

    // Increase the likes count
    if (increase) foundPost.countComments += 1;
    else foundPost.countComments -= 1;

    // Save the changes
    await foundPost.save({ transaction });

    await transaction.commit();
    return foundPost;
  } catch (error) {
    await transaction.rollback();
  }
};

//API: /posts/:postId/comments
export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = getUserId(req);

    handleCountCommentInPostTransaction(
      req.body.title,
      req.body.content,
      postId,
      userId,
      "",
      true,
    );

    res.status(201).json({ message: `New Comment is created.` });
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as any)?.message || "Internal server error." });
  }
};

//PutMapping /posts/:postId/comments/:commentId
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.params;

    const { content, title } = req.body;

    const foundPost = await Post.findByPk(postId);

    if (!foundPost) res.status(404).json({ message: "Post can not found." });

    const foundComment = await Comment.findByPk(commentId);

    if (foundComment) {
      foundComment.title = title;
      foundComment.content = content;
      // Updated timestamp.
      foundComment.updatedAt = new Date();
      await foundComment.save();
      res.status(200).json({ message: "Updated Comment Successfully." });
    } else {
      res.status(404).json({ message: "Comment can not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as any)?.message || "Internal server error." });
  }
};

//DeleteMapping /posts/:postId/comments/:commentId
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.params;
    handleCountCommentInPostTransaction(
      "",
      "",
      postId,
      getUserId(req),
      commentId,
      true,
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as any)?.message || "Internal server error." });
  }
};

//GetMapping /posts/:postId/comments
export const getAllCommentBasedOnPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const totalItems = await Comment.count({ where: { postId } });

    const { skip, limit, totalPages, page } = getPaginationFromRequest(
      req,
      totalItems,
    );

    const comments = await Comment.findAll({
      where: { postId },
      limit,
      offset: skip,
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    // Prepare paginated response
    const response: PaginatedResponse<ICommentResponse[]> = {
      content: comments.map((cmt) => {
        // @ts-ignore
        const userResponse = convertToUserResponse(cmt["user"] as User);
        return {
          id: cmt?.id,
          title: cmt?.title,
          content: cmt?.content,
          author: userResponse,
        };
      }),
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as any)?.message || "Internal server error." });
  }
};
