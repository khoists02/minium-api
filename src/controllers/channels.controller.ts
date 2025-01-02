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

import { ChannelLight } from "@src/data/channel";
import { convertPhotoUrlResponse } from "@src/helpers/convert";
import Channel from "@src/models/channels.model";
import Post from "@src/models/post.model";
import { getUserId } from "@src/utils/authentication";
import { catchErrorToResponse } from "@src/utils/http";
import { Request, Response } from "express";

export const createChannel = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    await Channel.create({ name, description, userId: getUserId(req) });
    res.status(200).json({ message: `Create channel ${name} success` });
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message || "Internal server error" });
  }
};

export const updateChannel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const foundChannel = await Channel.findByPk(id);

    if (!foundChannel) {
      res.status(400).json({ message: "Channel not found." });
    } else {
      foundChannel.name = name;
      foundChannel.description = description;
      await foundChannel.save();
      res.status(200).json({ message: "Update Channel success." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message || "Internal server error" });
  }
};

export const assignPostToChannel = async (req: Request, res: Response) => {
  try {
    const { channelId, postId } = req.params;

    const foundChannel = await Channel.findByPk(channelId);

    if (!foundChannel) res.status(400).json({ message: "Channel Not Found." });
    else {
      const postUpdated = await Post.findByPk(postId);
      if (!postUpdated) res.status(400).json({ message: "Post Not Found." });
      else {
        postUpdated.channelId = foundChannel.id;
        await postUpdated.save();

        res.send(200).json({
          message: "Assign post to channel " + foundChannel.name + " success",
        });
      }
    }
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const reAssignPostFromChannel = async (req: Request, res: Response) => {
  try {
    const { channelId, postId } = req.params;

    const foundChannel = await Channel.findByPk(channelId);

    if (!foundChannel) res.status(400).json({ message: "Channel Not Found." });
    else {
      const postUpdated = await Post.findByPk(postId);
      if (!postUpdated) res.status(400).json({ message: "Post Not Found." });
      else {
        // @ts-ignore
        postUpdated.channelId = null;
        await postUpdated.save();

        res.send(200).json({
          message:
            "Re-Assign post to channel " + foundChannel.name + " success.",
        });
      }
    }
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const deleteChannels = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const foundChannel = await Channel.findByPk(id);

    if (!foundChannel) {
      res.status(400).json({ message: "Channel not found." });
    } else {
      await Channel.destroy();
      //
      const [affectedCount] = await Post.update(
        { channelId: null },
        {
          where: {
            channelId: id,
          },
        },
      );

      res.send(200).json({ message: `Post updated ${affectedCount}` });
    }
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

/**
 * Get all or get with dropdown mode => api/public/channels?mode=dropdown
 * @param req
 * @param res
 */
export const getMyChannels = async (req: Request, res: Response) => {
  try {
    const { mode, userId } = req.query;

    const myChannels = await Channel.findAll({
      // @ts-ignore
      where: { userId: userId },
    });

    if (mode === "dropdown") {
      res.status(200).json({
        content: myChannels.map((c) => {
          return {
            id: c.id,
            name: c.name,
          } as ChannelLight;
        }),
      });
    } else {
      res.status(200).json({ content: myChannels });
    }
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const getChannelsDetails = async (req: Request, res: Response) => {
  try {
    const details = await Channel.findByPk(req.params.id);
    const finalBannerUrl = convertPhotoUrlResponse(req, details?.bannerUrl);
    res.status(200).json({
      channel: {
        ...details,
        bannerUrl: finalBannerUrl,
      },
    });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const uploadChannelBanner = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const foundChannel = await Channel.findByPk(req.params.id);
    const url = `/uploads/${req.file?.filename}`;
    if (!foundChannel)
      return res.status(400).json({ message: "Channel not found." });

    if (foundChannel) {
      foundChannel.bannerUrl = url;
    }

    await foundChannel.save();

    res.status(200).json({ message: "Channel banner uploaded." });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};

export const deleteChannelBanner = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const foundChannel = await Channel.findByPk(req.params.id);
    if (!foundChannel)
      return res.status(400).json({ message: "Channel not found." });

    foundChannel.bannerUrl = "";
    await foundChannel.save();
    res.status(200).json({ message: "Delete banner success." });
  } catch (error) {
    catchErrorToResponse(res, error);
  }
};
