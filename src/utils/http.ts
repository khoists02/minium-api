import { Response } from "express";

export const catchErrorToResponse = (response: Response, error: any) => {
  response
    .status(500)
    .json({ message: (error as Error).message || "Internal server error" });
};
