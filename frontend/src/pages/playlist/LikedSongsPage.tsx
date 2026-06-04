import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Pause, Play, Heart } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SongActionMenu from "@/components/SongActionMenu";

const LikedSongsPage = () => {
	const { fetchFavorites, favorites, isLoading } = usePlaylistStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
	const navigate = useNavigate();

	useEffect(() => {
		fetchFavorites();
	}, [fetchFavorites]);

	if (isLoading && favorites.length === 0) {
		return (
			<div className="h-full flex items-center justify-center text-zinc-400">
				Loading liked songs...
			</div>
		);
	}

	const handlePlayFavorites = () => {
		if (favorites.length === 0) return;

		const isCurrentFavoritesPlaying = favorites.some(
			(song) => song._id === currentSong?._id
		);

		if (isCurrentFavoritesPlaying) {
			togglePlay();
		} else {
			playAlbum(favorites, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		playAlbum(favorites, index);
	};

	return (
		<div className="h-full">
			<ScrollArea className="h-full rounded-md">
				{/* Main Content */}
				<div className="relative min-h-full">
					{/* bg gradient */}
					<div
						className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-zinc-900/80 to-zinc-900 pointer-events-none"
						aria-hidden="true"
					/>

					{/* Content */}
					<div className="relative z-10">
						<div className="flex p-6 gap-6 pb-8">
							<div className="w-[240px] h-[240px] rounded bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl flex-shrink-0">
								<Heart className="size-28 text-white fill-white animate-pulse" />
							</div>
							<div className="flex flex-col justify-end">
								<p className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Playlist</p>
								<h1 className="text-5xl sm:text-7xl font-bold my-4 text-white leading-tight">
									Liked Songs
								</h1>
								<div className="flex items-center gap-2 text-sm text-zinc-300">
									<span className="font-semibold text-white">Your Favorites</span>
									<span>•</span>
									<span>{favorites.length} songs</span>
								</div>
							</div>
						</div>

						{/* Play button row */}
						<div className="px-6 pb-6 flex items-center gap-4">
							<Button
								onClick={handlePlayFavorites}
								disabled={favorites.length === 0}
								size="icon"
								className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all flex items-center justify-center"
							>
								{isPlaying && favorites.some((song) => song._id === currentSong?._id) ? (
									<Pause className="h-7 w-7 text-black fill-black" />
								) : (
									<Play className="h-7 w-7 text-black fill-black ml-1" />
								)}
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
									{favorites.length === 0 ? (
										<div className="text-center py-20 text-zinc-500 text-sm">
											Songs you like will appear here. Start liking some tracks!
										</div>
									) : (
										favorites.map((song, index) => {
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
														<SongActionMenu song={song} />
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
		</div>
	);
};

export default LikedSongsPage;
