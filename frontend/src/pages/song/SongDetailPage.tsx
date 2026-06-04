import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useCommentStore } from "@/stores/useCommentStore";
import { useAuth } from "@clerk/clerk-react";
import {
	Play,
	Pause,
	MessageCircle,
	Send,
	Trash2,
	Edit3,
	Music,
	Check,
	X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import { Song, Comment } from "@/types";
import toast from "react-hot-toast";


const formatTimeAgo = (dateString: string) => {
	const now = new Date();
	const date = new Date(dateString);
	const diffMs = now.getTime() - date.getTime();
	const diffSecs = Math.floor(diffMs / 1000);
	const diffMins = Math.floor(diffSecs / 60);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffDays > 0) return `${diffDays} ngày trước`;
	if (diffHours > 0) return `${diffHours} giờ trước`;
	if (diffMins > 0) return `${diffMins} phút trước`;
	return "Vừa xong";
};

const getUserFromComment = (comment: Comment) => {
	if (typeof comment.userId === "object" && comment.userId !== null) {
		return comment.userId as { _id: string; fullName: string; imageUrl: string; clerkId: string };
	}
	return null;
};

const SongDetailPage = () => {
	const { songId } = useParams<{ songId: string }>();
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
	const { comments, isLoading: commentsLoading, isSubmitting, fetchComments, addComment, deleteComment, updateComment, clearComments } = useCommentStore();
	const { getToken, userId: clerkUserId, isSignedIn } = useAuth();

	const [song, setSong] = useState<Song | null>(null);
	const [pageLoading, setPageLoading] = useState(true);
	const [newComment, setNewComment] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editContent, setEditContent] = useState("");
	const [activeTab, setActiveTab] = useState<"comments" | "lyrics">("comments");
	const commentInputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (!songId) return;
		setPageLoading(true);
		axiosInstance
			.get(`/songs/${songId}`)
			.then((res) => setSong(res.data))
			.catch(() => toast.error("Không thể tải thông tin bài hát"))
			.finally(() => setPageLoading(false));

		fetchComments(songId);

		return () => clearComments();
	}, [songId]);

	const isCurrentSong = currentSong?._id === song?._id;

	const handlePlay = () => {
		if (!song) return;
		if (isCurrentSong) {
			togglePlay();
		} else {
			setCurrentSong(song);
		}
	};

	const handleSubmitComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || !songId) return;
		if (!isSignedIn) {
			toast.error("Vui lòng đăng nhập để bình luận");
			return;
		}
		const token = await getToken();
		if (!token) return;
		await addComment(songId, newComment, token);
		setNewComment("");
	};

	const handleDeleteComment = async (commentId: string) => {
		if (!confirm("Xóa bình luận này?")) return;
		const token = await getToken();
		if (!token) return;
		await deleteComment(commentId, token);
	};

	const handleStartEdit = (comment: Comment) => {
		setEditingId(comment._id);
		setEditContent(comment.content);
	};

	const handleSubmitEdit = async (commentId: string) => {
		if (!editContent.trim()) return;
		const token = await getToken();
		if (!token) return;
		await updateComment(commentId, editContent, token);
		setEditingId(null);
	};

	if (pageLoading) {
		return (
			<div className="h-full flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 rounded-full border-4 border-green-500/30 border-t-green-500 animate-spin" />
					<p className="text-zinc-400 text-sm animate-pulse">Đang tải bài hát...</p>
				</div>
			</div>
		);
	}

	if (!song) {
		return (
			<div className="h-full flex items-center justify-center text-zinc-400">
				Không tìm thấy bài hát.
			</div>
		);
	}

	const genreColors: Record<string, string> = {
		pop: "bg-pink-500/20 text-pink-300 border-pink-500/30",
		rock: "bg-red-500/20 text-red-300 border-red-500/30",
		jazz: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
		rnb: "bg-purple-500/20 text-purple-300 border-purple-500/30",
		classical: "bg-blue-500/20 text-blue-300 border-blue-500/30",
		default: "bg-zinc-700/50 text-zinc-300 border-zinc-600/30",
	};

	const getGenreColor = (genre: string) =>
		genreColors[genre.toLowerCase()] || genreColors.default;

	return (
		<div className="h-full">
			<ScrollArea className="h-full rounded-md">
				<div className="relative min-h-full">
					{/* Animated gradient background */}
					<div
						className="absolute inset-0 pointer-events-none"
						aria-hidden="true"
						style={{
							background:
								"linear-gradient(160deg, rgba(16,185,129,0.18) 0%, rgba(30,20,60,0.7) 40%, rgba(9,9,11,1) 80%)",
						}}
					/>

					<div className="relative z-10 pb-12">
						{/* Hero section */}
						<div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 items-center sm:items-end">
							{/* Album art with glow */}
							<div className="relative flex-shrink-0 group">
								<div
									className="absolute -inset-4 rounded-2xl opacity-60 blur-2xl group-hover:opacity-80 transition-opacity duration-500"
									style={{ background: "radial-gradient(circle, rgba(16,185,129,0.4), transparent)" }}
								/>
								<img
									src={song.imageUrl}
									alt={song.title}
									className="relative w-44 h-44 sm:w-60 sm:h-60 rounded-xl shadow-2xl object-cover ring-1 ring-white/10"
								/>
							</div>

							{/* Song info */}
							<div className="flex flex-col gap-3 text-center sm:text-left">
								<p className="text-xs font-semibold text-green-400 uppercase tracking-widest">
									Bài hát
								</p>
								<h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
									{song.title}
								</h1>
								<p className="text-lg text-zinc-300 font-medium">{song.artist}</p>

								<div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-zinc-400 flex-wrap">
									<span>{song.createdAt?.split("T")[0]}</span>
									{song.genres && song.genres.length > 0 && (
										<>
											<span>•</span>
											<div className="flex gap-1.5 flex-wrap justify-center sm:justify-start">
												{song.genres.map((g) => (
													<span
														key={g}
														className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getGenreColor(g)}`}
													>
														{g}
													</span>
												))}
											</div>
										</>
									)}
								</div>

								{/* Play button */}
								<div className="flex items-center gap-3 justify-center sm:justify-start mt-2">
									<Button
										id="song-detail-play-btn"
										onClick={handlePlay}
										size="icon"
										className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all shadow-lg shadow-green-500/30"
									>
										{isCurrentSong && isPlaying ? (
											<Pause className="h-7 w-7 text-black fill-black" />
										) : (
											<Play className="h-7 w-7 text-black fill-black ml-1" />
										)}
									</Button>
									<span className="text-sm text-zinc-400">
										{isCurrentSong && isPlaying ? "Đang phát" : "Phát nhạc"}
									</span>
								</div>
							</div>
						</div>

						{/* Tabs: Comments / Lyrics */}
						<div className="px-6 sm:px-8 mt-4">
							<div className="flex gap-1 border-b border-white/10 mb-6">
								<button
									id="tab-comments"
									onClick={() => setActiveTab("comments")}
									className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
										activeTab === "comments"
											? "border-green-500 text-green-400"
											: "border-transparent text-zinc-400 hover:text-zinc-200"
									}`}
								>
									<MessageCircle className="h-4 w-4" />
									Bình luận
									<span className="ml-1 px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs">
										{comments.length}
									</span>
								</button>
								{song.lyrics && (
									<button
										id="tab-lyrics"
										onClick={() => setActiveTab("lyrics")}
										className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
											activeTab === "lyrics"
												? "border-green-500 text-green-400"
												: "border-transparent text-zinc-400 hover:text-zinc-200"
										}`}
									>
										<Music className="h-4 w-4" />
										Lời bài hát
									</button>
								)}
							</div>

							{/* Comments tab */}
							{activeTab === "comments" && (
								<div className="max-w-2xl">
									{/* Comment input */}
									{isSignedIn ? (
										<form
											onSubmit={handleSubmitComment}
											className="mb-8 bg-zinc-900/60 backdrop-blur rounded-xl p-4 border border-white/8 ring-1 ring-white/5"
										>
											<p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
												Để lại bình luận
											</p>
											<textarea
												ref={commentInputRef}
												id="comment-input"
												value={newComment}
												onChange={(e) => setNewComment(e.target.value)}
												placeholder="Chia sẻ cảm nhận của bạn về bài hát này..."
												rows={3}
												className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
												onKeyDown={(e) => {
													if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
														handleSubmitComment(e as any);
													}
												}}
											/>
											<div className="flex items-center justify-between mt-3">
												<p className="text-xs text-zinc-600">Ctrl + Enter để gửi</p>
												<Button
													id="submit-comment-btn"
													type="submit"
													disabled={isSubmitting || !newComment.trim()}
													className="bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-5 py-2 h-9 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
												>
													{isSubmitting ? (
														<div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
													) : (
														<Send className="h-4 w-4" />
													)}
													Gửi
												</Button>
											</div>
										</form>
									) : (
										<div className="mb-8 bg-zinc-900/40 border border-white/8 rounded-xl p-5 text-center">
											<MessageCircle className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
											<p className="text-zinc-400 text-sm mb-3">
												Đăng nhập để bình luận bài hát này
											</p>
											<Button
												onClick={() => (window.location.href = "/signin")}
												className="bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-5"
											>
												Đăng nhập
											</Button>
										</div>
									)}

									{/* Comments list */}
									{commentsLoading ? (
										<div className="space-y-4">
											{[1, 2, 3].map((i) => (
												<div key={i} className="flex gap-3 animate-pulse">
													<div className="w-9 h-9 rounded-full bg-zinc-800 flex-shrink-0" />
													<div className="flex-1 space-y-2">
														<div className="h-3 bg-zinc-800 rounded w-1/4" />
														<div className="h-3 bg-zinc-800 rounded w-3/4" />
													</div>
												</div>
											))}
										</div>
									) : comments.length === 0 ? (
										<div className="flex flex-col items-center gap-3 py-12 text-center">
											<MessageCircle className="h-12 w-12 text-zinc-700" />
											<p className="text-zinc-500 text-sm">
												Chưa có bình luận nào. Hãy là người đầu tiên!
											</p>
										</div>
									) : (
										<div className="space-y-4">
											{comments.map((comment) => {
												const user = getUserFromComment(comment);
												const isOwner =
													user?.clerkId === clerkUserId ||
													(typeof comment.userId === "string" && comment.userId === clerkUserId);
												const isEditing = editingId === comment._id;

												return (
													<div
														key={comment._id}
														className="group flex gap-3 p-4 rounded-xl hover:bg-white/4 transition-colors border border-transparent hover:border-white/6"
													>
														{/* Avatar */}
														<div className="flex-shrink-0">
															{user?.imageUrl ? (
																<img
																	src={user.imageUrl}
																	alt={user.fullName}
																	className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
																/>
															) : (
																<div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center text-white text-sm font-bold">
																	{(user?.fullName || "U")[0].toUpperCase()}
																</div>
															)}
														</div>

														{/* Content */}
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-1 flex-wrap">
																<span className="text-sm font-semibold text-white">
																	{user?.fullName || "Người dùng"}
																</span>
																<span className="text-xs text-zinc-500">
																	{formatTimeAgo(comment.createdAt)}
																</span>
															</div>

															{isEditing ? (
																<div className="space-y-2">
																	<textarea
																		id={`edit-comment-${comment._id}`}
																		value={editContent}
																		onChange={(e) => setEditContent(e.target.value)}
																		rows={2}
																		className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50"
																		autoFocus
																	/>
																	<div className="flex gap-2">
																		<button
																			id={`save-edit-${comment._id}`}
																			onClick={() => handleSubmitEdit(comment._id)}
																			className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-400 text-black rounded-lg text-xs font-semibold transition-colors"
																		>
																			<Check className="h-3 w-3" /> Lưu
																		</button>
																		<button
																			id={`cancel-edit-${comment._id}`}
																			onClick={() => setEditingId(null)}
																			className="flex items-center gap-1 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-xs font-semibold transition-colors"
																		>
																			<X className="h-3 w-3" /> Hủy
																		</button>
																	</div>
																</div>
															) : (
																<p className="text-sm text-zinc-300 leading-relaxed break-words">
																	{comment.content}
																</p>
															)}
														</div>

														{/* Actions */}
														{isOwner && !isEditing && (
															<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 self-start mt-0.5">
																<button
																	id={`edit-btn-${comment._id}`}
																	onClick={() => handleStartEdit(comment)}
																	title="Chỉnh sửa"
																	className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60 transition-colors"
																>
																	<Edit3 className="h-3.5 w-3.5" />
																</button>
																<button
																	id={`delete-btn-${comment._id}`}
																	onClick={() => handleDeleteComment(comment._id)}
																	title="Xóa"
																	className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
																>
																	<Trash2 className="h-3.5 w-3.5" />
																</button>
															</div>
														)}
													</div>
												);
											})}
										</div>
									)}
								</div>
							)}

							{/* Lyrics tab */}
							{activeTab === "lyrics" && song.lyrics && (
								<div className="max-w-2xl">
									<div className="bg-zinc-900/40 border border-white/8 rounded-xl p-6">
										<pre className="text-zinc-300 text-sm leading-loose whitespace-pre-wrap font-sans">
											{song.lyrics}
										</pre>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default SongDetailPage;
