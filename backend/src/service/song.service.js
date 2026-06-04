import { Song } from "../models/song.model.js";

export const getSongByIdService = async (songId) => {
	return await Song.findById(songId).populate("albumId");
};

export const getAllSongsService = async () => {
	return await Song.find().sort({ createdAt: -1 });
};

export const getFeaturedSongsService = async () => {
	return await Song.aggregate([
		{
			$sample: { size: 6 },
		},
	]);
};

export const getMadeForYouSongsService = async () => {
	return await Song.aggregate([
		{
			$sample: { size: 4 },
		},
	]);
};

export const getTrendingSongsService = async () => {
	return await Song.find().sort({ playCount: -1, createdAt: -1 });
};

export const incrementPlayCountService = async (songId) => {
	return await Song.findByIdAndUpdate(
		songId,
		{ $inc: { playCount: 1 } },
		{ new: true }
	);
};

export const searchSongsService = async (query) => {
	if (!query) return [];
	const regex = new RegExp(query, "i");
	return await Song.find({
		$or: [
			{ title: regex },
			{ artist: regex },
			{ genres: regex }
		]
	}).sort({ createdAt: -1 });
};
