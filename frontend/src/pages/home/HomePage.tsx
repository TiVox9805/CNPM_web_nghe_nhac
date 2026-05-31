import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useRef, useState } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { ArrowLeft, Clock, Pause, Play, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SongActionMenu from "@/components/SongActionMenu";
import SearchResults from "./components/SearchResults";

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		fetchPublicSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
		songs,
		searchResults,
		searchSongs,
		clearSearchResults,
	} = useMusicStore();

	const { initializeQueue, currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
	const [activeSection, setActiveSection] = useState<"made-for-you" | "trending" | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	useEffect(() => {
		if (activeSection) {
			fetchPublicSongs();
		}
	}, [activeSection, fetchPublicSongs]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	// Debounced backend search query
	useEffect(() => {
		if (!searchQuery.trim()) {
			clearSearchResults();
			return;
		}

		const timer = setTimeout(() => {
			searchSongs(searchQuery);
		}, 350);

		return () => clearTimeout(timer);
	}, [searchQuery, searchSongs, clearSearchResults]);

	const isSearching = searchQuery.trim().length > 0;

	const handlePlaySectionSong = (index: number) => {
		playAlbum(songs, index);
	};

	const handlePlayAllSection = () => {
		if (songs.length === 0) return;
		const isCurrentSongInSection = songs.some((s) => s._id === currentSong?._id);
		if (isCurrentSongInSection) {
			togglePlay();
		} else {
			playAlbum(songs, 0);
		}
	};

	if (activeSection) {
		const sectionTitle = activeSection === "made-for-you" ? "Made For You" : "Trending";
		const sectionDesc = activeSection === "made-for-you"
			? "Your personalized daily mix of fresh tracks, handpicked by our recommendations engine."
			: "The hottest tracks trending across the platform right now.";
		const bannerBg = activeSection === "made-for-you" ? "from-[#1e3a8a]/80" : "from-[#b91c1c]/80";

		return (
			<main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900 relative">
				<Topbar />
				<ScrollArea className="h-[calc(100vh-180px)]">
					{/* Header Banner */}
					<div className={`relative p-6 sm:p-8 flex flex-col gap-6 bg-gradient-to-b ${bannerBg} via-zinc-900/90 to-zinc-900`}>
						<div className="flex items-center gap-4">
							<Button
								onClick={() => setActiveSection(null)}
								variant="ghost"
								size="icon"
								className="rounded-full bg-black/40 hover:bg-black/60 text-white hover:text-white"
							>
								<ArrowLeft className="h-5 w-5" />
							</Button>
							<span className="text-xs uppercase font-bold tracking-widest text-zinc-300">Playlist</span>
						</div>

						<div className='flex flex-col gap-2'>
							<h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white">{sectionTitle}</h1>
							<p className="text-sm sm:text-base text-zinc-300 max-w-xl font-medium mt-1 leading-relaxed">
								{sectionDesc}
							</p>
							<div className="flex items-center gap-2 text-sm text-zinc-400 mt-2">
								<span className="font-semibold text-white">Dreamweaver</span>
								<span>•</span>
								<span>{songs.length} songs</span>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-4 mt-4">
							<Button
								onClick={handlePlayAllSection}
								size="icon"
								className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all flex items-center justify-center shadow-lg"
							>
								{isPlaying && songs.some((s) => s._id === currentSong?._id) ? (
									<Pause className="h-7 w-7 text-black fill-black" />
								) : (
									<Play className="h-7 w-7 text-black fill-black ml-1" />
								)}
							</Button>
						</div>
					</div>

					{/* Songs List Table */}
					<div className="bg-black/20 backdrop-blur-sm px-4 sm:px-6">
						{/* Table Header */}
						<div className="grid grid-cols-[16px_4fr_1fr_40px] sm:grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-4 py-3 text-sm text-zinc-400 border-b border-white/5 font-semibold">
							<div>#</div>
							<div>Title</div>
							<div className='hidden sm:block'>Released Date</div>
							<div className="flex justify-end">
								<Clock className="h-4 w-4" />
							</div>
							<div></div>
						</div>

						{/* Table Songs */}
						<div className="space-y-1 py-4">
							{songs.map((song, index) => {
								const isCurrentSong = currentSong?._id === song._id;
								return (
									<div
										key={song._id}
										onClick={() => handlePlaySectionSong(index)}
										className={`grid grid-cols-[16px_4fr_1fr_40px] sm:grid-cols-[16px_4fr_2fr_1fr_40px] gap-4 px-4 py-3 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer items-center transition-all ${isCurrentSong ? "bg-white/5" : ""
											}`}
									>
										<div className="flex items-center justify-center">
											{isCurrentSong && isPlaying ? (
												<div className="size-4 text-green-500 font-bold">♫</div>
											) : (
												<span className="group-hover:hidden text-zinc-500">{index + 1}</span>
											)}
											<Play className="h-4 w-4 text-white fill-white hidden group-hover:block" />
										</div>

										<div className="flex items-center gap-3 min-w-0">
											<img
												src={song.imageUrl}
												alt={song.title}
												className="w-10 h-10 object-cover rounded shadow-md border border-white/5"
											/>
											<div className="min-w-0">
												<div className={`font-semibold truncate ${isCurrentSong ? "text-green-500" : "text-white"}`}>
													{song.title}
												</div>
												<div className="text-zinc-400 text-xs truncate mt-0.5">{song.artist}</div>
											</div>
										</div>

										<div className="truncate text-zinc-300 font-medium hidden sm:block">
											{song.createdAt?.split("T")[0] || "N/A"}
										</div>

										<div className="flex justify-end text-zinc-300 font-medium">
											{formatDuration(song.duration)}
										</div>
										<div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
											<SongActionMenu song={song} />
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</ScrollArea>
			</main>
		);
	}

	return (
		<main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
			<Topbar />
			<ScrollArea className="h-[calc(100vh-180px)]">
				<div className="p-4 sm:p-6">
					{/* Search Bar */}
					<div className="relative mb-6 group">
						<div className={`flex items-center gap-3 px-4 py-3 rounded-full border transition-all duration-200 ${isSearching
								? "bg-white/10 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
								: "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
							}`}>
							<Search className={`h-5 w-5 flex-shrink-0 transition-colors ${isSearching ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-300"}`} />
							<input
								ref={searchInputRef}
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search songs, artists, genres..."
								className="flex-1 bg-transparent text-white placeholder:text-zinc-500 text-sm outline-none font-medium"
							/>
							{isSearching && (
								<button
									onClick={() => {
										setSearchQuery("");
										searchInputRef.current?.focus();
									}}
									className="text-zinc-400 hover:text-white transition-colors flex-shrink-0"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
					</div>

					{/* Search Results or Normal Home */}
					{isSearching ? (
						<div key="search-view">
							<SearchResults songs={searchResults} query={searchQuery} />
						</div>
					) : (
						<div key="home-view">
							<h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Good afternoon</h1>
							<FeaturedSection />

							<div className="space-y-8 mt-8">
								<SectionGrid
									title="Made For You"
									songs={madeForYouSongs}
									isLoading={isLoading}
									onShowAll={() => setActiveSection("made-for-you")}
								/>
								<SectionGrid
									title="Trending"
									songs={trendingSongs}
									isLoading={isLoading}
									onShowAll={() => setActiveSection("trending")}
								/>
							</div>
						</div>
					)}
				</div>
			</ScrollArea>
		</main>
	);
};

export default HomePage;
