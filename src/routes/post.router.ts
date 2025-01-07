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
  checkVisibleLike,
  createPost,
  deletePost,
  getAllPost,
  getAllPostByUserId,
  getMyPosts,
  getPostDetails,
  likePost,
  publishPost,
  suggestedPosts,
  unlikePost,
  updatePost,
  uploadImage,
} from "@src/controllers/post.controller";
import { upload } from "@src/middlewares/upload";
const router = Router();
router.get("/posts/suggested", suggestedPosts);
router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.get("/posts/:postId", getPostDetails);
router.delete("/posts/:id", deletePost);
router.put("/posts/:id/publish", publishPost);
router.get("/posts", getAllPost);

router.get("/users/:userId/posts", getAllPostByUserId);
router.get("/myposts", getMyPosts);

router.post("/posts/:postId/users/:userId/like", likePost);
router.delete("/posts/:postId/users/:userId/unlike", unlikePost);
router.get("/posts/:postId/users/:userId/visible", checkVisibleLike);
// @ts-ignore
router.post("/posts/upload", upload.single("postImage"), uploadImage);
// getPostDetails
// @ts-ignore
export default router;
