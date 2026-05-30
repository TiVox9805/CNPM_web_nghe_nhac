import { Router } from "express";
import {
	addFavorite,
	removeFavorite,
	getMyFavorites,
	checkIsFavorite,
} from "../controller/favorite.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// All favorite routes require authentication
router.use(protectRoute);

router.post("/", addFavorite);
router.delete("/", removeFavorite);
router.get("/", getMyFavorites);
router.get("/check/:songId", checkIsFavorite);

export default router;
