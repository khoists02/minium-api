import { Router } from "express";
import { createPost, deletePost, getAllPost, getAllPostByUserId, getMyPosts, getPostDetails, publishPost, updatePost, uploadImage } from "@src/controllers/post.controller";
import { upload } from "@src/middlewares/upload";
const router = Router();

router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.get("/posts/:postId", getPostDetails);
router.delete("/posts/:id", deletePost);
router.put("/posts/:id/publish", publishPost);
router.get("/posts", getAllPost);
router.get("/users/:userId/posts", getAllPostByUserId);
router.get("/myposts", getMyPosts);

// @ts-ignore
router.post("/posts/upload", upload.single("postImage"), uploadImage);
// getPostDetails
// @ts-ignore
export default router;