import { usePlayerStore } from "@/stores/usePlayerStore";
import { Mic2, Pause, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

const FloatingArtwork = () => {
	const { currentSong, isPlaying, togglePlay, toggleLyrics, showLyrics, showFloatingArtwork, toggleFloatingArtwork } = usePlayerStore();
	const [isHovered, setIsHovered] = useState(false);
	const [prevSongId, setPrevSongId] = useState<string | null>(null);

	// Re-show the card whenever a new song starts
	useEffect(() => {
		if (currentSong && currentSong._id !== prevSongId) {
			if (!showFloatingArtwork) toggleFloatingArtwork();
			setPrevSongId(currentSong._id);
		}
	}, [currentSong, prevSongId]);

	if (!currentSong || !showFloatingArtwork || showLyrics) return null;

	return (
		<div
			className='fixed right-6 bottom-28 z-40 animate-float-smooth animate-fade-slide-up'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Outer glow ring */}
			<div
				className={`absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-500/30 via-purple-500/20 to-transparent blur-md transition-opacity duration-500 ${
					isHovered ? "opacity-100" : "opacity-60"
				}`}
			/>

			{/* Card */}
			<div className='relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm bg-black/40'>
				{/* Spinning album art */}
				<img
					src={currentSong.imageUrl}
					alt={currentSong.title}
					className={`w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110 animate-spin-slow ${
						isPlaying ? "" : "paused"
					}`}
					style={{ animationPlayState: isPlaying ? "running" : "paused" }}
				/>

				{/* Gradient overlay - always slightly visible at bottom */}
				<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent' />

				{/* Song info strip - bottom */}
				<div
					className={`absolute bottom-0 left-0 right-0 px-3 pb-2 pt-6 transition-all duration-300 ${
						isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
					}`}
				>
					<p className='text-white font-semibold text-xs truncate leading-tight'>{currentSong.title}</p>
					<p className='text-emerald-400 text-[10px] truncate mt-0.5'>{currentSong.artist}</p>
				</div>

				{/* Center play/pause button - shown on hover */}
				<div
					className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
						isHovered ? "opacity-100" : "opacity-0"
					}`}
				>
					<button
						onClick={togglePlay}
						className='w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 active:scale-95'
					>
						{isPlaying ? (
							<Pause className='h-6 w-6 text-white fill-white' />
						) : (
							<Play className='h-6 w-6 text-white fill-white ml-0.5' />
						)}
					</button>
				</div>

				{/* Top-right control buttons */}
				<div
					className={`absolute top-2 right-2 flex gap-1.5 transition-all duration-300 ${
						isHovered ? "opacity-100" : "opacity-0"
					}`}
				>
					{/* Lyrics button */}
					<button
						onClick={toggleLyrics}
						title='View Lyrics'
						className='w-7 h-7 rounded-full bg-black/50 hover:bg-emerald-500/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110'
					>
						<Mic2 className='h-3.5 w-3.5 text-white' />
					</button>

					{/* Dismiss button */}
					<button
						onClick={toggleFloatingArtwork}
						title='Dismiss'
						className='w-7 h-7 rounded-full bg-black/50 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110'
					>
						<X className='h-3.5 w-3.5 text-white' />
					</button>
				</div>

				{/* Playing indicator dots - bottom left, visible when not hovered */}
				{isPlaying && (
					<div
						className={`absolute bottom-2 left-3 flex items-end gap-0.5 transition-all duration-300 ${
							isHovered ? "opacity-0" : "opacity-100"
						}`}
					>
						{[0, 0.2, 0.4].map((delay, i) => (
							<div
								key={i}
								className='w-0.5 rounded-full bg-emerald-400'
								style={{
									height: "8px",
									animation: `spin-slow 0.8s ease-in-out ${delay}s infinite alternate`,
									animationName: "float-smooth",
									animationDuration: `${0.6 + i * 0.15}s`,
									animationDelay: `${delay}s`,
									animationTimingFunction: "ease-in-out",
									animationIterationCount: "infinite",
									animationDirection: "alternate",
								}}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default FloatingArtwork;
