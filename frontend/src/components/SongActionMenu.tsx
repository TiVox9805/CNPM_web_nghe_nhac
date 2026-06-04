import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Heart, Trash2, ListMusic, ExternalLink, Share2 } from "lucide-react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { Song } from "@/types";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "@/stores/useChatStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";

interface SongActionMenuProps {
	song: Song;
	playlistId?: string;
}

export const SongActionMenu = ({ song, playlistId }: SongActionMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showPlaylists, setShowPlaylists] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	const {
		playlists,
		addSongToPlaylist,
		removeSongFromPlaylist,
		toggleFavorite,
		isFavorite,
	} = usePlaylistStore();

	const isFav = isFavorite(song._id);

	const [isShareOpen, setIsShareOpen] = useState(false);
	const [userSearchQuery, setUserSearchQuery] = useState("");
	const { user: currentUser } = useUser();
	const { users, fetchUsers, sendMessage } = useChatStore();

	useEffect(() => {
		if (isShareOpen) {
			fetchUsers();
		}
	}, [isShareOpen, fetchUsers]);

	const filteredUsers = users.filter(
		(u) =>
			u.clerkId !== currentUser?.id &&
			u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase())
	);

	const handleShareSong = (targetUser: any) => {
		if (!currentUser) {
			toast.error("Vui lòng đăng nhập để chia sẻ");
			return;
		}

		const songPayload = {
			_id: song._id,
			title: song.title,
			artist: song.artist,
			imageUrl: song.imageUrl,
			audioUrl: song.audioUrl
		};

		sendMessage(
			targetUser.clerkId,
			currentUser.id,
			`[SONG_SHARE]:${JSON.stringify(songPayload)}`
		);

		toast.success(`Đã chia sẻ bài hát tới ${targetUser.fullName}`);
		setIsShareOpen(false);
	};

	// Close menu on click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsOpen(false);
				setShowPlaylists(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.stopPropagation();
		toggleFavorite(song);
		setIsOpen(false);
	};

	const handleAddToPlaylist = (e: React.MouseEvent, targetPlaylistId: string) => {
		e.stopPropagation();
		addSongToPlaylist(targetPlaylistId, song._id);
		setIsOpen(false);
		setShowPlaylists(false);
	};

	const handleRemoveFromPlaylist = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (playlistId) {
			removeSongFromPlaylist(playlistId, song._id);
		}
		setIsOpen(false);
	};

	return (
		<SignedIn>
			<div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
				<button
					onClick={(e) => {
						e.stopPropagation();
						setIsOpen(!isOpen);
						setShowPlaylists(false);
					}}
					className="p-2 hover:bg-zinc-800 hover:text-white rounded-full text-zinc-400 transition-colors focus:outline-none"
					title="More options"
				>
					<MoreHorizontal className="h-5 w-5" />
				</button>

				{isOpen && (
					<div className="absolute right-0 mt-2 w-56 rounded-md bg-zinc-950 border border-zinc-800 shadow-xl z-50 py-1 text-sm text-zinc-300 animate-in fade-in duration-100">
						{/* View Song Details */}
						<button
							onClick={(e) => {
								e.stopPropagation();
								setIsOpen(false);
								navigate(`/songs/${song._id}`);
							}}
							className="w-full px-4 py-2 hover:bg-zinc-900 hover:text-white flex items-center gap-3 transition-colors text-left"
						>
							<ExternalLink className="h-4 w-4" />
							<span>Xem chi tiết bài hát</span>
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setIsOpen(false);
								setIsShareOpen(true);
							}}
							className="w-full px-4 py-2 hover:bg-zinc-900 hover:text-white flex items-center gap-3 transition-colors text-left"
						>
							<Share2 className="h-4 w-4" />
							<span>Chia sẻ bài hát</span>
						</button>
						<div className="h-[1px] bg-zinc-800 my-1" />
						{/* Toggle Favorite Option */}
						<button
							onClick={handleToggleFavorite}
							className="w-full px-4 py-2 hover:bg-zinc-900 hover:text-white flex items-center gap-3 transition-colors text-left"
						>
							<Heart className={`h-4 w-4 ${isFav ? "fill-green-500 text-green-500" : ""}`} />
							<span>{isFav ? "Remove from Liked Songs" : "Save to Liked Songs"}</span>
						</button>

						{/* Add to Playlist Expandable Option */}
						<div className="relative group/sub">
							<button
								onMouseEnter={() => setShowPlaylists(true)}
								onClick={(e) => {
									e.stopPropagation();
									setShowPlaylists(!showPlaylists);
								}}
								className="w-full px-4 py-2 hover:bg-zinc-900 hover:text-white flex items-center justify-between gap-3 transition-colors text-left"
							>
								<div className="flex items-center gap-3">
									<ListMusic className="h-4 w-4" />
									<span>Add to Playlist</span>
								</div>
								<span className="text-[10px] text-zinc-500">▶</span>
							</button>

							{showPlaylists && (
								<div className="absolute right-full top-0 mr-1 w-52 rounded-md bg-zinc-950 border border-zinc-800 shadow-xl py-1 z-50 max-h-48 overflow-y-auto">
									{playlists.length === 0 ? (
										<div className="px-4 py-2 text-xs text-zinc-500">No playlists found</div>
									) : (
										playlists.map((pl) => (
											<button
												key={pl._id}
												onClick={(e) => handleAddToPlaylist(e, pl._id)}
												className="w-full px-4 py-2 hover:bg-zinc-900 hover:text-white text-left truncate block text-xs"
											>
												{pl.name}
											</button>
										))
									)}
								</div>
							)}
						</div>

						{/* Remove from current playlist Option (if applicable) */}
						{playlistId && (
							<>
								<div className="h-[1px] bg-zinc-800 my-1" />
								<button
									onClick={handleRemoveFromPlaylist}
									className="w-full px-4 py-2 hover:bg-red-950/40 hover:text-red-400 text-red-500 flex items-center gap-3 transition-colors text-left"
								>
									<Trash2 className="h-4 w-4" />
									<span>Remove from Playlist</span>
								</button>
							</>
						)}
					</div>
				)}
			</div>
			{/* Share Dialog */}
			<Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
				<DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
					<DialogHeader>
						<DialogTitle className="text-xl font-bold flex items-center gap-2">
							<Share2 className="h-5 w-5 text-green-500" />
							<span>Chia sẻ bài hát</span>
						</DialogTitle>
						<DialogDescription className="text-zinc-400 text-sm">
							Chọn một người bạn để gửi bài hát <span className="text-white font-semibold">"{song.title}"</span>.
						</DialogDescription>
					</DialogHeader>

					<div className="my-4" onClick={(e) => e.stopPropagation()}>
						<input
							type="text"
							placeholder="Tìm kiếm bạn bè..."
							value={userSearchQuery}
							onChange={(e) => setUserSearchQuery(e.target.value)}
							className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all mb-4"
						/>

						<ScrollArea className="h-64 pr-2">
							<div className="space-y-2">
								{filteredUsers.length === 0 ? (
									<div className="text-center py-8 text-zinc-500 text-sm">
										Không tìm thấy người dùng nào
									</div>
								) : (
									filteredUsers.map((u) => (
										<div
											key={u._id}
											onClick={() => handleShareSong(u)}
											className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900 cursor-pointer transition-all border border-transparent hover:border-zinc-800"
										>
											<Avatar className="h-9 w-9">
												<AvatarImage src={u.imageUrl} alt={u.fullName} />
												<AvatarFallback className="bg-zinc-800 text-white text-xs">
													{u.fullName[0].toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-semibold truncate">{u.fullName}</p>
											</div>
											<button className="px-3 py-1 bg-green-500 hover:bg-green-400 text-black text-xs font-bold rounded-full transition-all active:scale-95">
												Gửi
											</button>
										</div>
									))
								)}
							</div>
						</ScrollArea>
					</div>
				</DialogContent>
			</Dialog>
		</SignedIn>
	);
};
export default SongActionMenu;
