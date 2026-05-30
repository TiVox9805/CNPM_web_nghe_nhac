import { getAllAlbumsService, getAlbumByIdService } from "../service/album.service.js";

export const getAllAlbums = async (req, res, next) => {
	try {
		const albums = await getAllAlbumsService();
		res.status(200).json(albums);
	} catch (error) {
		next(error);
	}
};

export const getAlbumById = async (req, res, next) => {
	try {
		const { albumId } = req.params;

		const album = await getAlbumByIdService(albumId);

		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		res.status(200).json(album);
	} catch (error) {
		next(error);
	}
};
