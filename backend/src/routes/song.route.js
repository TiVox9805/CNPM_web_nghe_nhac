import { Router } from "express";
import { getAllSongs, getAllSongsPublic, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, searchSongs, getSongById, incrementPlayCount } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAdmin, getAllSongs);
router.get("/all", getAllSongsPublic);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/search", searchSongs);
router.get("/:songId", getSongById);
router.post("/:songId/play", incrementPlayCount);

export default router;
