import { Router } from "express";
import {
	createPlaylist,
	getMyPlaylists,
	getPlaylistById,
	updatePlaylist,
	deletePlaylist,
	addSongToPlaylist,
	removeSongFromPlaylist,
} from "../controller/playlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// All playlist routes require authentication
router.use(protectRoute);

router.post("/", createPlaylist);
router.get("/", getMyPlaylists);
router.get("/:id", getPlaylistById);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

router.post("/:id/songs", addSongToPlaylist);
router.delete("/:id/songs", removeSongFromPlaylist);

export default router;
