import { Album } from "../models/album.model.js";

export const getAllAlbumsService = async () => {
	return await Album.find();
};

export const getAlbumByIdService = async (albumId) => {
	return await Album.findById(albumId).populate("songs");
};
