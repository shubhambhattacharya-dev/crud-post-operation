import express from "express";
import multer from "multer";
import protectRoute from "../middleware/protectRoute.js";
import {
	bookmarkUnbookmarkPost,
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getBookmarkedPosts,
	likeUnlikePost,
	repostUnrepostPost,
} from "../controllers/post.controller.js";

const router = express.Router();

import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/all", protectRoute, getAllPosts);
router.post("/create", protectRoute, upload.single("img"), createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/repost/:id", protectRoute, repostUnrepostPost);
router.post("/bookmark/:id", protectRoute, bookmarkUnbookmarkPost);
router.get("/bookmarks/:id", protectRoute, getBookmarkedPosts);
router.delete("/:id", protectRoute, deletePost);

export default router;
