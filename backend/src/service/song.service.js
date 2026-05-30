import { Song } from "../models/song.model.js";

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
	return await Song.aggregate([
		{
			$sample: { size: 4 },
		},
	]);
};
