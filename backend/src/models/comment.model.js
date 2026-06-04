import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    songId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
export const Comment = mongoose.model(
    "Comment",
    commentSchema
);