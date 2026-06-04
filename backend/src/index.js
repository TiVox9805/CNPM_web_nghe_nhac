import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cron from "node-cron";
import { createServer } from "http";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";

import { initializeSocket } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import favoriteRoutes from "./routes/favorite.route.js";
import commentRoutes from "./routes/comment.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:5000",
			"https://cnpm-webnghenhacnhom2-production.up.railway.app",
			"https://dreamwever.vercel.app",
			"https://cnpm-web-nghe-nhac-nhom2.vercel.app",
		],
		credentials: true,
	})
);

app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next();
});

app.use(express.json());
app.use(clerkMiddleware());

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "tmp"),
		createParentPath: true,
		limits: {
			fileSize: 10 * 1024 * 1024,
		},
	})
);

const tempDir = path.join(process.cwd(), "tmp");

cron.schedule("0 * * * *", () => {
	try {
		if (!fs.existsSync(tempDir)) return;

		const files = fs.readdirSync(tempDir);
		for (const file of files) {
			fs.unlinkSync(path.join(tempDir, file));
		}
	} catch (err) {
		console.log("Temp cleanup error:", err.message);
	}
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/comments", commentRoutes);
const frontendPath = path.join(__dirname, "../../frontend/dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
	res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/api/health", (req, res) => {
	res.json({
		status: "ok",
		message: "Server is running",
	});
});

app.use((err, req, res, next) => {
	console.error("Server Error:", err);

	res.status(err.status || 500).json({
		message:
			process.env.NODE_ENV === "production"
				? "Internal server error"
				: err.message,
	});
});

const startServer = async () => {
	try {
		await connectDB();
		httpServer.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Startup failed:", error);

		// Railway không nên crash process
	}
};

startServer();