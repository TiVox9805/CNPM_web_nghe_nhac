import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsersService = async (currentClerkId) => {
	return await User.find({ clerkId: { $ne: currentClerkId } });
};

export const getMessagesService = async (myClerkId, otherClerkId) => {
	return await Message.find({
		$or: [
			{ senderId: otherClerkId, receiverId: myClerkId },
			{ senderId: myClerkId, receiverId: otherClerkId },
		],
	}).sort({ createdAt: 1 });
};

export const getMongoUserIdByClerkId = async (clerkId) => {
	const user = await User.findOne({ clerkId });
	return user ? user._id : null;
};
