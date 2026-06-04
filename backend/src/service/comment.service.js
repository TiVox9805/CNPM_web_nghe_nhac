import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";

export const getCommentsBySongService = async (songId) => {
	return await Comment.find({ songId })
		.populate("userId", "fullName imageUrl clerkId")
		.sort({ createdAt: -1 });
};

export const addCommentService = async (userId, songId, content) => {
	const comment = new Comment({ userId, songId, content });
	await comment.save();
	return await comment.populate("userId", "fullName imageUrl clerkId");
};

export const deleteCommentService = async (commentId, userId) => {
	const comment = await Comment.findById(commentId);
	if (!comment) throw new Error("Comment not found");
	if (comment.userId.toString() !== userId.toString()) {
		throw new Error("Unauthorized");
	}
	await Comment.findByIdAndDelete(commentId);
	return comment;
};

export const updateCommentService = async (commentId, userId, content) => {
	const comment = await Comment.findById(commentId);
	if (!comment) throw new Error("Comment not found");
	if (comment.userId.toString() !== userId.toString()) {
		throw new Error("Unauthorized");
	}
	comment.content = content;
	await comment.save();
	return await comment.populate("userId", "fullName imageUrl clerkId");
};
