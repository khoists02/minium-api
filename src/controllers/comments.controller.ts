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
import { convertToUserResponse } from "@src/utils/convert";
import { runInTransaction } from "@src/helpers/transaction";
import { Transaction } from "sequelize";
import { catchErrorToResponse } from "@src/utils/http";
import CommentLikes from "@src/models/comment_likes.model";
import { IUserResponse } from "@src/data/user";
import CommentReply from "@src/models/comment_reply.model";
import { Op } from "sequelize";
import { convertPhotoUrlResponse } from "@src/helpers/convert";

//API: /posts/:postId/comments
export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = getUserId(req);
    const { title, content } = req.body;

    runInTransaction(false, async (t: Transaction) => {
      const foundPost = await Post.findByPk(postId, { transaction: t });
      if (!foundPost)
        return res.status(404).json({ message: "Post not found." });
      await Comment.create(
        { title, content, postId, userId },
        { transaction: t },
      );

      foundPost.countComments += 1;
      await foundPost.save({ transaction: t });
      t.commit();
      res.status(201).json({ message: `New Comment is created.` });
    });
  } catch (error) {
    catchErrorToResponse(res, error);
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
    catchErrorToResponse(res, error);
  }
};

//DeleteMapping /posts/:postId/comments/:commentId
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.params;

    runInTransaction(false, async (t: Transaction) => {
      const foundPost = await Post.findByPk(postId, { transaction: t });

      if (!foundPost)
        return res.status(400).json({ message: "Post not found." });

      const foundComment = await Comment.findOne({
        where: { postId, userId: getUserId(req), id: commentId },
        transaction: t,
      });
      await foundComment?.destroy({ transaction: t });

      foundPost.countComments -= 1;
      await foundPost.save({ transaction: t });

      await t.commit();

      res.status(200).json({ message: "Comment is deleted." });
    });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

//GetMapping /posts/:postId/comments
export const getAllCommentBasedOnPost = async (
  req: Request,
  res: Response,
): Promise<any> => {
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
          attributes: ["id", "name", "email", "description", "photoUrl"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    const finalComments: ICommentResponse[] = [];

    // handle get visible like
    for (let i = 0; i < comments.length; i++) {
      // @ts-ignore
      const foundUser = comments[i] ? comments[i]["user"] : null;
      const userResponse = foundUser
        ? convertToUserResponse(req, foundUser)
        : null;
      const visibleLike = await getVisibleLikeInComment(
        getUserId(req),
        postId,
        comments[i].id,
      );

      finalComments.push({
        id: comments[i]?.id,
        title: comments[i]?.title,
        content: comments[i]?.content,
        author: userResponse as IUserResponse,
        lastUpdatedAt: comments[i]?.updatedAt || comments[i]?.createdAt,
        visibleLike: visibleLike,
        countLikes: comments[i]?.countLikes || 0,
        countReplies: comments[i]?.countReplies || 0,
      });
    }
    // Prepare paginated response
    const response: PaginatedResponse<ICommentResponse[]> = {
      content: finalComments,
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };
    return res.json(response);
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

// this method will check this comment was liked by current user.
export const getVisibleLikeInComment = async (
  userId: string,
  postId: string,
  commentId: string,
): Promise<boolean> => {
  try {
    const foundComment = await CommentLikes.findOne({
      where: {
        userId,
        postId,
        commentId,
      },
    });

    return Promise.resolve(!!foundComment);
  } catch (error) {
    return Promise.reject();
  }
};

//PUT /public/posts/:postId/comments/:commentId
export const handleLikeOrUnlikeComment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { liked, userId } = req.body;
    const { postId, commentId } = req.params;

    runInTransaction(false, async (t: Transaction) => {
      const foundPost = await Post.findByPk(postId, { transaction: t });
      if (!foundPost)
        return res.send(400).json({ message: "Bad request, Not found post." });

      const foundComment = await Comment.findByPk(commentId, {
        transaction: t,
      });

      if (!foundComment)
        return res
          .send(400)
          .json({ message: "Bad request, Comment was delete." });

      // handle create/destroy comment likes

      if (!liked) {
        await CommentLikes.create(
          { userId: userId, postId: postId, commentId: commentId },
          { transaction: t },
        );

        foundComment.countLikes += 1;

        await foundComment.save({ transaction: t });
      } else {
        const foundCommentLikes = await CommentLikes.findOne({
          where: { userId, postId, commentId },
          transaction: t,
        });

        if (foundCommentLikes) {
          await foundCommentLikes.destroy({ transaction: t });
          foundComment.countLikes -= 1;
          await foundComment.save({ transaction: t });
        }
      }
      await t.commit();
      res.status(200).json({
        message: `User ${userId} like this comment ${commentId} on Post:${postId}`,
      });
    });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

/**
 * Replies comment
 * POST
 * PUT
 * DELETE
 */

// POST: comments/:commentId/replies, { content: "xxx"}
export const replyComment = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    runInTransaction(false, async (t: Transaction) => {
      // check record has exited.
      const foundComment = await Comment.findByPk(commentId, {
        transaction: t,
      });
      if (!foundComment)
        return res.status(404).json({ message: "Comment was deleted." });

      // create new record to applies table.
      await CommentReply.create(
        {
          userId: getUserId(req),
          commentId,
          content,
        },
        {
          transaction: t,
        },
      );

      // count reply in comment.

      foundComment.countReplies += 1;
      await foundComment.save({
        transaction: t,
      });

      await t.commit();
      res.status(201).json({ message: "Reply to comment " + commentId });
    });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

// PUT: comments/:commentId/replies/:id, { content: "xxx" }
export const updateReplyComment = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { commentId, id } = req.params;
  const { content } = req.body;
  try {
    // check record has exited.
    const foundComment = await Comment.findByPk(commentId);
    if (!foundComment)
      return res.status(404).json({ message: "Comment was deleted." });

    const foundReply = await CommentReply.findByPk(id);
    if (!foundReply)
      return res.status(404).json({ message: "Reply was deleted." });

    foundReply.content = content;
    foundReply.updatedAt = new Date();

    await foundReply.save();
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

// DELETE comments/:commentId/replies/:id
export const deleteReplyComment = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { commentId, id } = req.params;
    runInTransaction(false, async (t: Transaction) => {
      // check  comment record has exited.
      const foundComment = await Comment.findByPk(commentId, {
        transaction: t,
      });
      if (!foundComment)
        return res.status(404).json({ message: "Comment was deleted." });

      // check  reply of comment record has exited.
      const foundReply = await CommentReply.findByPk(id, { transaction: t });

      if (!foundReply)
        return res.status(404).json({ message: "Reply was deleted." });

      // destroy it.
      await foundReply.destroy({ transaction: t });

      // decrease count replies in comment.

      foundComment.countReplies -= 1;

      await foundComment.save({
        transaction: t,
      });

      await t.commit();
      res.status(201).json({ message: "Delete Reply to comment " + commentId });
    });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

const convertToReplyResponse = (req: Request, reply: CommentReply) => {
  // @ts-ignore
  const userResponse = convertToUserResponse(req, reply["user"] as User);
  const response = {
    id: reply?.id,
    createdAt: reply?.createdAt,
    commentId: reply?.commentId,
    updatedAt: reply?.updatedAt,
    content: reply?.content,
    author: userResponse,
  };
  return response;
};

// GET: comments/:commentId/replies
export const getAllReplies = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  try {
    const whereConditions: any = {};

    if (commentId) {
      whereConditions.commentId = { [Op.eq]: commentId }; // Partial match
    }

    const totalItems = await CommentReply.count({ where: whereConditions });

    const { skip, limit, totalPages, page } = getPaginationFromRequest(
      req,
      totalItems,
    );

    const replies = await CommentReply.findAll({
      where: whereConditions,
      include: {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "description", "photoUrl"],
      },
      offset: skip,
      limit: limit,
      order: [["updated_at", "DESC"]],
    });

    // Prepare paginated response
    const response: PaginatedResponse<any[]> = {
      content: replies.map((r) => {
        return convertToReplyResponse(req, r);
      }),
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };
    res.json(response);
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};
