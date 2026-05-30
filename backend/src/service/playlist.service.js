import { Playlist } from "../models/playlist.model.js";

export const createPlaylistService = async (mongoUserId, { name, description, imageUrl }) => {
	const playlist = new Playlist({
		name,
		description,
		imageUrl,
		userId: mongoUserId,
		songs: [],
	});
	return await playlist.save();
};

export const getPlaylistsService = async (mongoUserId) => {
	return await Playlist.find({ userId: mongoUserId }).sort({ createdAt: -1 });
};

export const getPlaylistByIdService = async (playlistId) => {
	return await Playlist.findById(playlistId).populate("songs");
};

export const updatePlaylistService = async (playlistId, { name, description, imageUrl }) => {
	return await Playlist.findByIdAndUpdate(
		playlistId,
		{ name, description, imageUrl },
		{ new: true, runValidators: true }
	);
};

export const deletePlaylistService = async (playlistId) => {
	return await Playlist.findByIdAndDelete(playlistId);
};

export const addSongToPlaylistService = async (playlistId, songId) => {
	return await Playlist.findByIdAndUpdate(
		playlistId,
		{ $addToSet: { songs: songId } }, // $addToSet avoids duplicate songs in a playlist
		{ new: true }
	).populate("songs");
};

export const removeSongFromPlaylistService = async (playlistId, songId) => {
	return await Playlist.findByIdAndUpdate(
		playlistId,
		{ $pull: { songs: songId } },
		{ new: true }
	).populate("songs");
};
