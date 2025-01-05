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

import { Router } from "express";
import {
  getAllCommentBasedOnPost,
  getAllReplies,
  handleLikeOrUnlikeComment,
} from "@src/controllers/comments.controller";
import {
  getCountComments,
  getCountLikes,
  getPublicPost,
  getPublicPostDetails,
  postHaveFavorite,
} from "@src/controllers/post.controller";
import {
  getChannelsAllowed,
  getMyChannels,
} from "@src/controllers/channels.controller";

const router = Router();
router.get("/public/posts/:postId/comments", getAllCommentBasedOnPost);
router.get("/public/posts", getPublicPost);
router.get("/public/posts/:postId", getPublicPostDetails);
router.get("/public/posts/:postId/likes", getCountLikes);
router.get("/public/posts/:postId/comments", getCountComments);
router.get("/public/channels", getMyChannels);
router.get("/public/channels-allowed", getChannelsAllowed);
router.put(
  "/public/posts/:postId/comments/:commentId",
  handleLikeOrUnlikeComment,
);
router.put("/public/posts/:postId/favorite", postHaveFavorite);

// GET ALL REPLIES OF COMMENT

router.get("/public/comments/:commentId/replies", getAllReplies);
export default router;
