import { Router } from "express";
import { getAllCommentBasedOnPost } from "@src/controllers/comments.controller";

const router = Router();
router.get("/public/posts:postId/comments", getAllCommentBasedOnPost);

export default router;