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

import {
  assignPostToChannel,
  createChannel,
  deleteChannelBanner,
  deleteChannels,
  getChannelsDetails,
  reAssignPostFromChannel,
  updateChannel,
  uploadChannelBanner,
} from "@src/controllers/channels.controller";
import { getAllPostsOfChannels } from "@src/controllers/post.controller";
import { upload } from "@src/middlewares/upload";
import { Router } from "express";

const router = Router();

router.post("/channels", createChannel);
router.put("/channels/:id", updateChannel);
router.get("/channels/:id", getChannelsDetails);
router.delete("/channels/:id", deleteChannels);
router.get("/channels/:channelId/posts", getAllPostsOfChannels);

// re/assign post to channels
router.put("/channels/:channelId/posts/:postId", assignPostToChannel);
router.delete("/channels/:channelId/posts/:postId", reAssignPostFromChannel);

// upload banner
// @ts-ignore
router.post(
  "/channels/:id/banner",
  upload.single("channelBanner"),
  uploadChannelBanner,
);
router.delete("/channels/:id/banner", deleteChannelBanner);

export default router;
