import { Router } from "express";
import { getAllCommentBasedOnPost } from "@src/controllers/comments.controller";
import { getPublicPost } from "@src/controllers/post.controller";

const router = Router();
router.get("/public/posts/:postId/comments", getAllCommentBasedOnPost);
router.get("/public/posts", getPublicPost);

export default router;