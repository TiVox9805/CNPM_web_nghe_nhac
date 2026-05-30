import {
	createPlaylistService,
	getPlaylistsService,
	getPlaylistByIdService,
	updatePlaylistService,
	deletePlaylistService,
	addSongToPlaylistService,
	removeSongFromPlaylistService,
} from "../service/playlist.service.js";
import { getMongoUserIdByClerkId } from "../service/user.service.js";

export const createPlaylist = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const mongoUserId = await getMongoUserIdByClerkId(clerkId);
		if (!mongoUserId) {
			return res.status(404).json({ message: "User not found" });
		}

		const { name, description, imageUrl } = req.body;
		if (!name) {
			return res.status(400).json({ message: "Playlist name is required" });
		}

		const playlist = await createPlaylistService(mongoUserId, { name, description, imageUrl });
		res.status(201).json(playlist);
	} catch (error) {
		next(error);
	}
};

export const getMyPlaylists = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const mongoUserId = await getMongoUserIdByClerkId(clerkId);
		if (!mongoUserId) {
			return res.status(404).json({ message: "User not found" });
		}

		const playlists = await getPlaylistsService(mongoUserId);
		res.status(200).json(playlists);
	} catch (error) {
		next(error);
	}
};

export const getPlaylistById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const playlist = await getPlaylistByIdService(id);
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}
		res.status(200).json(playlist);
	} catch (error) {
		next(error);
	}
};

export const updatePlaylist = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, description, imageUrl } = req.body;

		const playlist = await updatePlaylistService(id, { name, description, imageUrl });
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}
		res.status(200).json(playlist);
	} catch (error) {
		next(error);
	}
};

export const deletePlaylist = async (req, res, next) => {
	try {
		const { id } = req.params;
		const playlist = await deletePlaylistService(id);
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}
		res.status(200).json({ message: "Playlist deleted successfully" });
	} catch (error) {
		next(error);
	}
};

export const addSongToPlaylist = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { songId } = req.body;
		if (!songId) {
			return res.status(400).json({ message: "Song ID is required" });
		}

		const playlist = await addSongToPlaylistService(id, songId);
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}
		res.status(200).json(playlist);
	} catch (error) {
		next(error);
	}
};

export const removeSongFromPlaylist = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { songId } = req.body;
		if (!songId) {
			return res.status(400).json({ message: "Song ID is required" });
		}

		const playlist = await removeSongFromPlaylistService(id, songId);
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}
		res.status(200).json(playlist);
	} catch (error) {
		next(error);
	}
};
