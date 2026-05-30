import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        imageUrl: {
            type: String,
            default: "",
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);