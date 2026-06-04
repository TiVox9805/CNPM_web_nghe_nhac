import { Router } from "express";
import {
	getCommentsBySong,
	addComment,
	deleteComment,
	updateComment,
} from "../controller/comment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/comments/:songId - public, anyone can read comments
router.get("/:songId", getCommentsBySong);

// Protected routes - must be logged in
router.use(protectRoute);
router.post("/:songId", addComment);
router.delete("/:commentId", deleteComment);
router.put("/:commentId", updateComment);

export default router;
