import { Router } from "express";
import { createPost, deletePost, getAllPost, getAllPostByUserId, updatePost } from "@src/controllers/post.controller";

const router = Router();

router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);
router.get("/posts", getAllPost);
router.get("/users/:userId/posts", getAllPostByUserId);
// @ts-ignore
export default router;