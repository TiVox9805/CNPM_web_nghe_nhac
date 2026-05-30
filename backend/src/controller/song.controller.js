import {
	getAllSongsService,
	getFeaturedSongsService,
	getMadeForYouSongsService,
	getTrendingSongsService,
} from "../service/song.service.js";

export const getAllSongs = async (req, res, next) => {
	try {
		const songs = await getAllSongsService();
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getAllSongsPublic = async (req, res, next) => {
	try {
		const songs = await getAllSongsService();
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		const songs = await getFeaturedSongsService();
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await getMadeForYouSongsService();
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await getTrendingSongsService();
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

