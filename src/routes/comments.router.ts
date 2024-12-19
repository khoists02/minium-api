import { Router } from "express";
import { createComment, deleteComment, updateComment, getAllCommentBasedOnPost } from "@src/controllers/comments.controller";

const router = Router();

router.post("/posts/:postId/comments", createComment);
router.put("/posts/:postId/comments/:commentId", updateComment);
router.get("/posts/:postId/comments/:commentId", deleteComment);
router.get("/posts:postId/comments", getAllCommentBasedOnPost);

export default router;