import {
	addFavoriteService,
	removeFavoriteService,
	getFavoritesService,
	checkIsFavoriteService,
} from "../service/favorite.service.js";
import { getMongoUserIdByClerkId } from "../service/user.service.js";

export const addFavorite = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const mongoUserId = await getMongoUserIdByClerkId(clerkId);
		if (!mongoUserId) {
			return res.status(404).json({ message: "User not found" });
		}

		const { songId } = req.body;
		if (!songId) {
			return res.status(400).json({ message: "Song ID is required" });
		}

		const favorite = await addFavoriteService(mongoUserId, songId);
		res.status(201).json(favorite);
	} catch (error) {
		// Handle duplicate key error from unique index
		if (error.code === 11000) {
			return res.status(400).json({ message: "Song is already in favorites" });
		}
		next(error);
	}
};

export const removeFavorite = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const mongoUserId = await getMongoUserIdByClerkId(clerkId);
		if (!mongoUserId) {
			return res.status(404).json({ message: "User not found" });
		}

		const { songId } = req.body;
		if (!songId) {
			return res.status(400).json({ message: "Song ID is required" });
		}

		await removeFavoriteService(mongoUserId, songId);
		res.status(200).json({ message: "Song removed from favorites" });
	} catch (error) {
		next(error);
	}
};

export const getMyFavorites = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const mongoUserId = await getMongoUserIdByClerkId(clerkId);
		if (!mongoUserId) {
			return res.status(404).json({ message: "User not found" });
		}

		const favorites = await getFavoritesService(mongoUserId);
		res.status(200).json(favorites);
	} catch (error) {
		next(error);
	}
};

export const checkIsFavorite = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const mongoUserId = await getMongoUserIdByClerkId(clerkId);
		if (!mongoUserId) {
			return res.status(404).json({ message: "User not found" });
		}

		const { songId } = req.params;
		if (!songId) {
			return res.status(400).json({ message: "Song ID is required" });
		}

		const isFavorite = await checkIsFavoriteService(mongoUserId, songId);
		res.status(200).json({ isFavorite });
	} catch (error) {
		next(error);
	}
};
