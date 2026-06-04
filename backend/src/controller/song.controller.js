import {
	getSongByIdService,
	getAllSongsService,
	getFeaturedSongsService,
	getMadeForYouSongsService,
	getTrendingSongsService,
	searchSongsService,
	incrementPlayCountService,
} from "../service/song.service.js";

export const getSongById = async (req, res, next) => {
	try {
		const { songId } = req.params;
		const song = await getSongByIdService(songId);
		if (!song) {
			return res.status(404).json({ message: "Song not found" });
		}
		res.json(song);
	} catch (error) {
		next(error);
	}
};

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

export const searchSongs = async (req, res, next) => {
	try {
		const { q } = req.query;
		const songs = await searchSongsService(q);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

export const incrementPlayCount = async (req, res, next) => {
	try {
		const { songId } = req.params;
		const song = await incrementPlayCountService(songId);
		if (!song) {
			return res.status(404).json({ message: "Song not found" });
		}
		res.json(song);
	} catch (error) {
		next(error);
	}
};

