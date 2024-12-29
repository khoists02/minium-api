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
  deleteChannels,
  reAssignPostFromChannel,
  updateChannel,
} from "@src/controllers/channels.controller";
import { Router } from "express";

const router = Router();

router.post("/channels", createChannel);
router.put("/channels/:id", updateChannel);
router.delete("/channels/:id", deleteChannels);

router.put("/channels/:channelId/posts/:postId", assignPostToChannel);
router.delete("/channels/:channelId/posts/:postId", reAssignPostFromChannel);

export default router;
