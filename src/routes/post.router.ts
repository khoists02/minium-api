import { Router } from "express";
import { createPost, deletePost, getAllPost, getAllPostByUserId, getPostDetails, updatePost } from "@src/controllers/post.controller";

const router = Router();

router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.get("/posts/:postId", getPostDetails);
router.delete("/posts/:id", deletePost);
router.get("/posts", getAllPost);
router.get("/users/:userId/posts", getAllPostByUserId);
// getPostDetails
// @ts-ignore
export default router;