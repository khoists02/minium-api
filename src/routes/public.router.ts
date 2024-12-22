import { Router } from "express";
import { getAllCommentBasedOnPost } from "@src/controllers/comments.controller";
import { getPublicPost, getPublicPostDetails } from "@src/controllers/post.controller";

const router = Router();
router.get("/public/posts/:postId/comments", getAllCommentBasedOnPost);
router.get("/public/posts", getPublicPost);
router.get("/public/posts/:postId", getPublicPostDetails);
export default router;