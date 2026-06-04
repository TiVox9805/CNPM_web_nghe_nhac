import { Song } from "@/types";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Play, Pause, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface SearchResultsProps {
	songs: Song[];
	query: string;
}

const SearchResults = ({ songs, query }: SearchResultsProps) => {
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
	const navigate = useNavigate();

	if (songs.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-4">
				<div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
					<Music className="w-10 h-10 text-zinc-500" />
				</div>
				<div className="text-center">
					<p className="text-zinc-300 font-semibold text-lg">No results found</p>
					<p className="text-zinc-500 text-sm mt-1">
						No songs match <span className="text-white font-medium">"{query}"</span>
					</p>
				</div>
			</div>
		);
	}

	const handlePlay = (song: Song) => {
		if (currentSong?._id === song._id) {
			togglePlay();
		} else {
			setCurrentSong(song);
		}
	};

	return (
		<div className="mt-6">
			<p className="text-sm text-zinc-400 mb-4">
				Found <span className="text-white font-semibold">{songs.length}</span> result{songs.length !== 1 ? "s" : ""} for{" "}
				<span className="text-emerald-400 font-semibold">"{query}"</span>
			</p>

			<div className="space-y-1">
				{songs.map((song, index) => {
					const isCurrentSong = currentSong?._id === song._id;
					return (
						<div
							key={song._id}
							onClick={() => handlePlay(song)}
							onDoubleClick={() => navigate(`/songs/${song._id}`)}
							className={`grid grid-cols-[32px_1fr] sm:grid-cols-[32px_4fr_2fr] items-center gap-4 px-4 py-3 rounded-lg cursor-pointer group transition-all ${
								isCurrentSong ? "bg-white/10" : "hover:bg-white/5"
							}`}
							title="Double-click để xem chi tiết bài hát"
						>
							{/* Index or play icon */}
							<div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
								{isCurrentSong && isPlaying ? (
									<div key="playing-icon" className="text-emerald-400 text-base font-bold">♫</div>
								) : (
									<div key="standard-icon" className="contents">
										<span className={`text-zinc-500 text-sm group-hover:hidden ${isCurrentSong ? "hidden" : ""}`}>
											{index + 1}
										</span>
										<Play className={`h-4 w-4 text-white fill-white hidden group-hover:block ${isCurrentSong ? "block" : ""}`} />
									</div>
								)}
							</div>

							{/* Song info */}
							<div className="flex items-center gap-3 min-w-0">
								<div className="relative flex-shrink-0">
									<img
										src={song.imageUrl}
										alt={song.title}
										className={`w-11 h-11 object-cover rounded-md shadow-md border border-white/5 transition-all cursor-pointer ${
											isCurrentSong ? "ring-2 ring-emerald-400" : ""
										}`}
										onDoubleClick={(e) => { e.stopPropagation(); navigate(`/songs/${song._id}`); }}
										title="Double-click để xem chi tiết"
									/>
									{isCurrentSong && (
										<div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center">
											{isPlaying ? (
												<Pause className="h-4 w-4 text-white fill-white" />
											) : (
												<Play className="h-4 w-4 text-white fill-white" />
											)}
										</div>
									)}
								</div>
								<div className="min-w-0">
									<div className={`font-semibold text-sm truncate ${isCurrentSong ? "text-emerald-400" : "text-white"}`}>
										{song.title}
									</div>
									<div className="text-zinc-500 text-xs truncate mt-0.5">{song.artist}</div>
								</div>
							</div>

							{/* Genres */}
							<div className="hidden sm:flex items-center gap-1 flex-wrap">
								{(song.genres || []).slice(0, 2).map((genre) => (
									<span key={genre} className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
										{genre}
									</span>
								))}
							</div>


						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SearchResults;
