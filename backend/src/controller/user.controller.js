import { getAllUsersService, getMessagesService } from "../service/user.service.js";

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await getAllUsersService(currentUserId);
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await getMessagesService(myId, userId);

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};
