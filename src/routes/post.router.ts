import { Router } from "express";
import { createPost, deletePost, getAllPost, getAllPostByUserId, getMyPosts, getPostDetails, updatePost } from "@src/controllers/post.controller";

const router = Router();

router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.get("/posts/:postId", getPostDetails);
router.delete("/posts/:id", deletePost);
router.get("/posts", getAllPost);
router.get("/users/:userId/posts", getAllPostByUserId);
router.get("/myposts", getMyPosts);
// getPostDetails
// @ts-ignore
export default router;