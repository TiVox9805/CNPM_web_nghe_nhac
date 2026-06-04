import {
	getCommentsBySongService,
	addCommentService,
	deleteCommentService,
	updateCommentService,
} from "../service/comment.service.js";
import { getMongoUserIdByClerkId } from "../service/user.service.js";

export const getCommentsBySong = async (req, res, next) => {
	try {
		const { songId } = req.params;
		if (!songId) {
			return res.status(400).json({ message: "Song ID is required" });
		}

		const comments = await getCommentsBySongService(songId);
		res.status(200).json(comments);
	} catch (error) {
		next(error);
	}
};

export const addComment = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const mongoUserId = await getMongoUserIdByClerkId(clerkId);
		if (!mongoUserId) {
			return res.status(404).json({ message: "User not found" });
		}

		const { songId } = req.params;
		const { content } = req.body;

		if (!songId) {
			return res.status(400).json({ message: "Song ID is required" });
		}
		if (!content || !content.trim()) {
			return res.status(400).json({ message: "Content is required" });
		}

		const comment = await addCommentService(mongoUserId, songId, content.trim());
		res.status(201).json(comment);
	} catch (error) {
		next(error);
	}
};

export const deleteComment = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const mongoUserId = await getMongoUserIdByClerkId(clerkId);
		if (!mongoUserId) {
			return res.status(404).json({ message: "User not found" });
		}

		const { commentId } = req.params;
		if (!commentId) {
			return res.status(400).json({ message: "Comment ID is required" });
		}

		await deleteCommentService(commentId, mongoUserId);
		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		if (error.message === "Unauthorized") {
			return res.status(403).json({ message: "You can only delete your own comments" });
		}
		if (error.message === "Comment not found") {
			return res.status(404).json({ message: "Comment not found" });
		}
		next(error);
	}
};

export const updateComment = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const mongoUserId = await getMongoUserIdByClerkId(clerkId);
		if (!mongoUserId) {
			return res.status(404).json({ message: "User not found" });
		}

		const { commentId } = req.params;
		const { content } = req.body;

		if (!commentId) {
			return res.status(400).json({ message: "Comment ID is required" });
		}
		if (!content || !content.trim()) {
			return res.status(400).json({ message: "Content is required" });
		}

		const updated = await updateCommentService(commentId, mongoUserId, content.trim());
		res.status(200).json(updated);
	} catch (error) {
		if (error.message === "Unauthorized") {
			return res.status(403).json({ message: "You can only edit your own comments" });
		}
		if (error.message === "Comment not found") {
			return res.status(404).json({ message: "Comment not found" });
		}
		next(error);
	}
};
