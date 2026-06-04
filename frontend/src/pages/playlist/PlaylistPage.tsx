import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Pause, Play, Edit3, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SongActionMenu from "@/components/SongActionMenu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";


const PlaylistPage = () => {
	const { playlistId } = useParams<{ playlistId: string }>();
	const navigate = useNavigate();

	const {
		fetchPlaylistById,
		currentPlaylist,
		updatePlaylist,
		deletePlaylist,
		isLoading,
	} = usePlaylistStore();

	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	// Dialog states
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	useEffect(() => {
		if (playlistId) {
			fetchPlaylistById(playlistId);
		}
	}, [fetchPlaylistById, playlistId]);

	// Sync edit form fields when currentPlaylist changes
	useEffect(() => {
		if (currentPlaylist) {
			setName(currentPlaylist.name || "");
			setDescription(currentPlaylist.description || "");
			setImageUrl(currentPlaylist.imageUrl || "");
		}
	}, [currentPlaylist]);

	if (isLoading && !currentPlaylist) {
		return (
			<div className="h-full flex items-center justify-center text-zinc-400">
				Loading playlist...
			</div>
		);
	}

	if (!currentPlaylist) {
		return (
			<div className="h-full flex items-center justify-center text-zinc-400">
				Playlist not found.
			</div>
		);
	}

	const handlePlayPlaylist = () => {
		if (!currentPlaylist.songs || currentPlaylist.songs.length === 0) return;

		const isCurrentPlaylistPlaying = currentPlaylist.songs.some(
			(song) => song._id === currentSong?._id
		);

		if (isCurrentPlaylistPlaying) {
			togglePlay();
		} else {
			playAlbum(currentPlaylist.songs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		if (!currentPlaylist.songs) return;
		playAlbum(currentPlaylist.songs, index);
	};

	const handleUpdatePlaylist = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!playlistId || !name.trim()) return;

		await updatePlaylist(playlistId, name, description, imageUrl);
		setIsEditOpen(false);
	};

	const handleDeletePlaylist = async () => {
		if (!playlistId) return;
		if (window.confirm("Are you sure you want to delete this playlist? This action cannot be undone.")) {
			await deletePlaylist(playlistId);
			navigate("/");
		}
	};

	const defaultImg = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop";

	return (
		<div className="h-full">
			<ScrollArea className="h-full rounded-md">
				{/* Main Content */}
				<div className="relative min-h-full">
					{/* bg gradient */}
					<div
						className="absolute inset-0 bg-gradient-to-b from-indigo-900/60 via-zinc-900/80 to-zinc-900 pointer-events-none"
						aria-hidden="true"
					/>

					{/* Content */}
					<div className="relative z-10">
						<div className="flex p-6 gap-6 pb-8">
							<img
								src={currentPlaylist.imageUrl || defaultImg}
								alt={currentPlaylist.name}
								className="w-[240px] h-[240px] shadow-xl rounded object-cover"
							/>
							<div className="flex flex-col justify-end">
								<p className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Playlist</p>
								<h1 className="text-5xl sm:text-7xl font-bold my-4 text-white leading-tight">
									{currentPlaylist.name}
								</h1>
								{currentPlaylist.description && (
									<p className="text-sm text-zinc-300 mb-3 max-w-xl line-clamp-2">
										{currentPlaylist.description}
									</p>
								)}
								<div className="flex items-center gap-2 text-sm text-zinc-300">
									<span className="font-semibold text-white">Personal Playlist</span>
									<span>•</span>
									<span>{currentPlaylist.songs?.length || 0} songs</span>
								</div>
							</div>
						</div>

						{/* Actions row */}
						<div className="px-6 pb-6 flex items-center gap-4">
							<Button
								onClick={handlePlayPlaylist}
								disabled={!currentPlaylist.songs || currentPlaylist.songs.length === 0}
								size="icon"
								className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all flex items-center justify-center"
							>
								{isPlaying && currentPlaylist.songs?.some((song) => song._id === currentSong?._id) ? (
									<Pause className="h-7 w-7 text-black fill-black" />
								) : (
									<Play className="h-7 w-7 text-black fill-black ml-1" />
								)}
							</Button>

							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsEditOpen(true)}
								className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-10 w-10 border border-zinc-800"
								title="Edit Details"
							>
								<Edit3 className="h-5 w-5" />
							</Button>

							<Button
								variant="ghost"
								size="icon"
								onClick={handleDeletePlaylist}
								className="text-zinc-400 hover:text-red-400 hover:bg-red-950/20 rounded-full h-10 w-10 border border-zinc-800"
								title="Delete Playlist"
							>
								<Trash2 className="h-5 w-5" />
							</Button>
						</div>

						{/* Table Section */}
						<div className="bg-black/20 backdrop-blur-sm">
							{/* table header */}
							<div className="grid grid-cols-[16px_4fr_2fr_40px] gap-4 px-10 py-3 text-sm text-zinc-400 border-b border-white/5 font-semibold">
								<div>#</div>
								<div>Title</div>
								<div>Released Date</div>
								<div></div>
							</div>

							{/* songs list */}
							<div className="px-6">
								<div className="space-y-2 py-4">
									{!currentPlaylist.songs || currentPlaylist.songs.length === 0 ? (
										<div className="text-center py-10 text-zinc-500 text-sm">
											No songs in this playlist. Start adding songs!
										</div>
									) : (
										currentPlaylist.songs.map((song, index) => {
											const isCurrentSong = currentSong?._id === song._id;
											return (
												<div
													key={song._id}
													onClick={() => handlePlaySong(index)}
													className={`grid grid-cols-[16px_4fr_2fr_40px] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer items-center transition-all ${
														isCurrentSong ? "bg-white/5" : ""
													}`}
												>
													<div className="flex items-center justify-center">
														{isCurrentSong && isPlaying ? (
															<div className="size-4 text-green-500 font-bold">♫</div>
														) : (
															<span className="group-hover:hidden">{index + 1}</span>
														)}
														<Play className="h-4 w-4 hidden group-hover:block text-white fill-white" />
													</div>

													<div className="flex items-center gap-3 min-w-0">
														<img
															src={song.imageUrl}
															alt={song.title}
															className="size-10 object-cover rounded shadow-md cursor-pointer"
															onDoubleClick={(e) => { e.stopPropagation(); navigate(`/songs/${song._id}`); }}
															title="Double-click để xem chi tiết"
														/>
														<div className="min-w-0">
															<div className={`font-semibold truncate ${isCurrentSong ? "text-green-500" : "text-white"}`}>
																{song.title}
															</div>
															<div className="text-zinc-400 text-xs truncate mt-0.5">
																{song.artist}
															</div>
														</div>
													</div>
													<div className="flex items-center truncate text-zinc-300">
														{song.createdAt?.split("T")[0] || "N/A"}
													</div>
													<div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
														<SongActionMenu song={song} playlistId={playlistId} />
													</div>
												</div>
											);
										})
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>

			{/* Dialog to edit Playlist */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-md">
					<form onSubmit={handleUpdatePlaylist}>
						<DialogHeader>
							<DialogTitle className="text-xl font-bold">Edit Playlist Details</DialogTitle>
							<DialogDescription className="text-zinc-400 text-sm">
								Update information and custom artwork for your playlist.
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 my-6">
							<div className="space-y-2">
								<label className="text-sm font-semibold text-zinc-300">Name *</label>
								<Input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
									className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-green-500 placeholder:text-zinc-500"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold text-zinc-300">Description</label>
								<Input
									type="text"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-green-500 placeholder:text-zinc-500"
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-semibold text-zinc-300">Cover Image URL</label>
								<Input
									type="url"
									value={imageUrl}
									onChange={(e) => setImageUrl(e.target.value)}
									className="bg-zinc-900 border-zinc-800 text-white focus-visible:ring-green-500 placeholder:text-zinc-500"
								/>
							</div>
						</div>

						<DialogFooter className="gap-2 sm:gap-0">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setIsEditOpen(false)}
								className="text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="bg-green-500 hover:bg-green-400 text-black font-semibold"
							>
								Save Changes
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default PlaylistPage;
