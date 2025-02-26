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

import { sequelize } from "@src/database";
import { convertPhotoUrlResponse } from "@src/helpers/convert";
import { getPaginationFromRequest } from "@src/helpers/pagination";
import Channel from "@src/models/channels.model";
import Likes from "@src/models/like.model";
import Post from "@src/models/post.model";
import PostFavorite from "@src/models/post_favorite.model";
import User from "@src/models/user.model";
import { PaginatedResponse } from "@src/types/pagination";
import { IPostResponse, IPublicPostResponse } from "@src/types/user";
import { getUserId } from "@src/utils/authentication";
import { convertToUserResponse } from "@src/utils/convert";
import { catchErrorToResponse } from "@src/utils/http";
import { Request, Response } from "express";
import { json, Op } from "sequelize";

/**
 * Get all post based on for authenticated user
 * @param req
 * @param res
 */
export const getMyPosts = async (req: Request, res: Response) => {
  try {
    const { title } = req.query;

    const userId = getUserId(req);

    const foundUser = await User.findByPk(userId as string);

    if (!foundUser) res.status(404).json({ message: "User not found." });

    const whereConditions: any = {};

    if (title) {
      whereConditions.title = { [Op.like]: `%${title}%` }; // Partial match
    }

    if (userId) {
      whereConditions.userId = { [Op.eq]: userId }; // Partial match
    }

    const totalItems = await Post.count({ where: whereConditions });

    const { skip, limit, totalPages, page } = getPaginationFromRequest(
      req,
      totalItems,
    );

    const allPost = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "description", "photoUrl"],
        },
        {
          model: Channel,
          as: "channel",
          attributes: ["id", "name", "description", "bannerUrl"],
        },
      ],
      where: whereConditions,
      offset: skip,
      limit: limit,
    });
    // Prepare paginated response
    const response: PaginatedResponse<IPostResponse[]> = {
      content: allPost.map((u) => {
        return convertToPostResponse(req, u, ["content"]);
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

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const foundUser = await User.findByPk(userId);

    const { title, content } = req.body;

    if (foundUser)
      await Post.create({
        title,
        content,
        draft: true,
        userId: foundUser.id,
      });

    res.status(201).json({
      message: "Post created successfully",
    });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const foundPost = await Post.findByPk(id);

    if (foundPost) {
      const { title, content, description } = req.body;
      foundPost.title = title;
      foundPost.content = content;
      foundPost.description = description;
      foundPost.updatedAt = new Date();
      await foundPost.save();
    }

    res.status(200).json({ message: "Updated Post" });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const foundPost = await Post.findByPk(id);

    await foundPost?.destroy();

    res.status(200).json({ message: "Updated Post" });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

/**
 * Actions
 * like / unlike
 * @param req
 * @param res
 */

const handleCountLikeInPostTransaction = async (
  postId: string,
  userId: string,
  increase = true,
) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    const foundPost = await Post.findByPk(postId);

    if (!foundPost) {
      throw new Error("Post not found");
    }

    if (increase) await Likes.create({ postId, userId }, { transaction });
    else {
      const foundLike = await Likes.findOne({
        where: { postId, userId },
        transaction,
      });
      await foundLike?.destroy({ transaction });
    }

    // Increase the likes count
    if (increase) foundPost.countLikes += 1;
    else foundPost.countLikes -= 1;

    // Save the changes
    await foundPost.save({ transaction });

    await transaction.commit();
    return foundPost;
  } catch (error) {
    await transaction.rollback();
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId, userId } = req.params;
    const newPost = await handleCountLikeInPostTransaction(
      postId,
      userId,
      true,
    );

    res.status(200).json({ countLikes: newPost?.countLikes });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  try {
    const { postId, userId } = req.params;
    const newPost = await handleCountLikeInPostTransaction(
      postId,
      userId,
      false,
    );

    res.status(200).json({ countLikes: newPost?.countLikes });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const publishPost = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    const { channelId } = req.body;

    const foundChannel = await Channel.findByPk(channelId);

    if (!foundChannel)
      return res.status(400).json({ message: "Channel was deleted." });

    const foundPost = await Post.findByPk(id);

    if (!foundPost) return res.status(400).json({ message: "Bad Request." });

    foundPost.draft = false;
    foundPost.channelId = foundChannel?.id;
    foundPost.publishedAt = new Date();

    await foundPost?.save();

    res
      .status(200)
      .json({ message: `Published Post on channel ${foundChannel?.name}` });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

/**
 * Public
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

    const { skip, limit, totalPages, page } = getPaginationFromRequest(
      req,
      totalItems,
    );

    const allPost = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "description", "photoUrl"],
        },
        {
          model: Channel,
          as: "channel",
          attributes: ["id", "name", "description", "bannerUrl"],
        },
      ],
      where: whereConditions,
      offset: skip,
      limit: limit,
      order: [["updatedAt", "DESC"]],
    });
    // Prepare paginated response
    const response: PaginatedResponse<IPostResponse[]> = {
      content: allPost.map((u) => {
        return convertToPostResponse(req, u, ["content"]);
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
          attributes: ["id", "email", "name", "photoUrl", "description"],
        },
        {
          model: Channel,
          as: "channel",
          attributes: ["id", "name", "description", "bannerUrl"],
        },
      ],
    });
    res.status(200).json({
      post: convertToPostResponse(req, foundPost as Post, ["content"]),
    });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

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

    const foundUser = await User.findByPk(userId as string);

    if (!foundUser) res.status(404).json({ message: "User not found." });

    const whereConditions: any = {};

    if (title) {
      whereConditions.title = { [Op.like]: `%${title}%` }; // Partial match
    }

    if (userId) {
      whereConditions.userId = { [Op.eq]: userId }; // Partial match
    }

    const totalItems = await Post.count({ where: whereConditions });

    const { skip, limit, totalPages, page } = getPaginationFromRequest(
      req,
      totalItems,
    );

    const allPost = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "description", "photoUrl"],
        },
        {
          model: Channel,
          as: "channel",
          attributes: ["id", "name", "description", "bannerUrl"],
        },
      ],
      where: whereConditions,
      offset: skip,
      limit: limit,
    });
    // Prepare paginated response
    const response: PaginatedResponse<IPostResponse[]> = {
      content: allPost.map((u) => {
        return convertToPostResponse(req, u, ["content"]);
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

/**
 * Public post
 * @param req
 * @param res
 */

const convertToPostResponse = (
  req: Request,
  foundPost: Post,
  excluded: string[],
): IPostResponse => {
  // @ts-ignore
  const userResponse = convertToUserResponse(req, foundPost["user"] as User);
  // @ts-ignore
  const channelResponse = foundPost ? foundPost["channel"] : null;
  if (channelResponse?.bannerUrl) {
    channelResponse.bannerUrl = convertPhotoUrlResponse(
      req,
      channelResponse.bannerUrl,
    );
  }
  const response = {
    id: foundPost?.id,
    title: foundPost?.title,
    content: foundPost?.content,
    description: foundPost?.description,
    countLikes: foundPost?.countLikes,
    countComments: foundPost?.countComments,
    userId: foundPost?.userId,
    user: userResponse,
    channel: channelResponse,
    publishedAt: foundPost?.publishedAt,
    createdAt: foundPost?.createdAt,
    updatedAt: foundPost?.updatedAt,
    // @ts-ignore
    isFavorite: !!foundPost["favorite"],
  };

  for (let exclude of excluded) {
    // @ts-ignore
    delete response[exclude];
  }
  return response;
};

export const getPublicPost = async (req: Request, res: Response) => {
  try {
    const { title } = req.query;

    const whereConditions: any = {};

    if (title) {
      whereConditions.title = { [Op.like]: `%${title}%` }; // Partial match
    }

    // Filter post with publish status.
    whereConditions.draft = { [Op.eq]: false };

    const totalItems = await Post.count({ where: whereConditions });

    const { skip, limit, totalPages, page } = getPaginationFromRequest(
      req,
      totalItems,
    );

    const allPost = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "description", "photoUrl"],
        },
        {
          model: Channel,
          as: "channel",
          attributes: ["id", "name", "description", "bannerUrl"],
        },
        {
          model: PostFavorite,
          as: "favorite",
          attributes: ["id"],
        },
      ],
      where: whereConditions,
      offset: skip,
      limit: limit,
      order: [["updatedAt", "DESC"]],
    });

    // Prepare paginated response
    const response: PaginatedResponse<IPublicPostResponse[]> = {
      content: allPost.map((u) => {
        return convertToPostResponse(req, u, ["content"]);
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

/**
 * Get Post details include user.
 * @param req
 * @param res
 */
export const getPublicPostDetails = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const foundPost = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "description", "photoUrl"],
        },
        {
          model: Channel,
          as: "channel",
          attributes: ["id", "name", "description", "bannerUrl"],
        },
      ],
    });

    res.status(200).json({
      post: convertToPostResponse(req, foundPost as Post, []),
    });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ imgUrl: fileUrl });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const checkVisibleLike = async (req: Request, res: Response) => {
  try {
    const { postId, userId } = req.params;

    const count = await Likes.count({ where: { postId, userId } });

    res.json({ visible: count > 0 });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const getCountComments = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByPk(req.params.postId);

    res.json({ count: post?.countComments });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const getCountLikes = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByPk(req.params.postId);

    res.json({ count: post?.countLikes });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const getAllPostsOfChannels = async (req: Request, res: Response) => {
  try {
    const { title } = req.query;
    const { channelId } = req.params;

    const whereConditions: any = {};

    if (title) {
      whereConditions.title = { [Op.like]: `%${title}%` }; // Partial match
    }
    if (channelId) {
      whereConditions.channelId = { [Op.eq]: channelId }; // Partial match
    }

    const totalItems = await Post.count({ where: whereConditions });

    const { skip, limit, totalPages, page } = getPaginationFromRequest(
      req,
      totalItems,
    );

    const allPost = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "description", "photoUrl"],
        },
      ],
      where: whereConditions,
      offset: skip,
      limit: limit,
      order: [["updated_at", "DESC"]],
    });
    // Prepare paginated response
    const response: PaginatedResponse<IPostResponse[]> = {
      content: allPost.map((u) => {
        return convertToPostResponse(req, u, ["content"]);
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

// GET: /posts/:postId/favorite
export const postAsFavorite = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const pFavorite = await PostFavorite.count({
      where: { postId: req.params.postId, userId: getUserId(req) },
    });
    return res.status(200).json({ hasFavorite: pFavorite > 0 });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

/**
 * Favorite API
 * @param req
 * @param res
 * @returns
 */
export const markPostAsFavorite = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    await PostFavorite.create({
      postId: req.body.postId,
      userId: getUserId(req),
    });
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const unMarkPostAsFavorite = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const foundFavorite = await PostFavorite.findOne({
      where: { postId: req.params.postId, userId: getUserId(req) },
    });

    if (!foundFavorite) return;

    await foundFavorite.destroy();

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const suggestedPosts = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "description", "photoUrl"],
        },
        {
          model: Channel,
          as: "channel",
          attributes: ["id", "name", "description", "bannerUrl"],
        },
        {
          model: PostFavorite,
          as: "favorite",
          attributes: ["id"],
        },
      ],
      order: [
        ["countLikes", "DESC"],
        ["countComments", "DESC"],
      ],
      limit: 10,
    });

    return res.status(200).json({
      content: posts.map((p) => convertToPostResponse(req, p, ["content"])),
    });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};
