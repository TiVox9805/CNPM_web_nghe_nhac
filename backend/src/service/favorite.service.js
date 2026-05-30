import { Favorite } from "../models/favorite.model.js";

export const addFavoriteService = async (mongoUserId, songId) => {
	// index { userId: 1, songId: 1 } unique ensures only one record
	const favorite = new Favorite({
		userId: mongoUserId,
		songId,
	});
	return await favorite.save();
};

export const removeFavoriteService = async (mongoUserId, songId) => {
	return await Favorite.findOneAndDelete({
		userId: mongoUserId,
		songId,
	});
};

export const getFavoritesService = async (mongoUserId) => {
	const favorites = await Favorite.find({ userId: mongoUserId }).populate("songId");
	return favorites.map(fav => fav.songId).filter(Boolean); // Return array of songs
};

export const checkIsFavoriteService = async (mongoUserId, songId) => {
	const favorite = await Favorite.findOne({
		userId: mongoUserId,
		songId,
	});
	return !!favorite;
};
