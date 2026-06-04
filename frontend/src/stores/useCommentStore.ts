import { axiosInstance } from "@/lib/axios";
import { Comment } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface CommentStore {
	comments: Comment[];
	isLoading: boolean;
	isSubmitting: boolean;
	error: string | null;

	fetchComments: (songId: string) => Promise<void>;
	addComment: (songId: string, content: string, token: string) => Promise<void>;
	deleteComment: (commentId: string, token: string) => Promise<void>;
	updateComment: (commentId: string, content: string, token: string) => Promise<void>;
	clearComments: () => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
	comments: [],
	isLoading: false,
	isSubmitting: false,
	error: null,

	fetchComments: async (songId) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/comments/${songId}`);
			set({ comments: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	addComment: async (songId, content, token) => {
		set({ isSubmitting: true });
		try {
			const response = await axiosInstance.post(
				`/comments/${songId}`,
				{ content },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			set((state) => ({ comments: [response.data, ...state.comments] }));
			toast.success("Comment posted!");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to post comment");
		} finally {
			set({ isSubmitting: false });
		}
	},

	deleteComment: async (commentId, token) => {
		try {
			await axiosInstance.delete(`/comments/${commentId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			set((state) => ({
				comments: state.comments.filter((c) => c._id !== commentId),
			}));
			toast.success("Comment deleted");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to delete comment");
		}
	},

	updateComment: async (commentId, content, token) => {
		try {
			const response = await axiosInstance.put(
				`/comments/${commentId}`,
				{ content },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			set((state) => ({
				comments: state.comments.map((c) =>
					c._id === commentId ? response.data : c
				),
			}));
			toast.success("Comment updated");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to update comment");
		}
	},

	clearComments: () => {
		set({ comments: [], error: null });
	},
}));
