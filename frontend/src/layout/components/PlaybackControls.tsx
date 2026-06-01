import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { SignedIn } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import { Laptop2, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious, showLyrics, toggleLyrics, showFloatingArtwork, toggleFloatingArtwork } = usePlayerStore();
	const { toggleFavorite, isFavorite } = usePlaylistStore();

	const [volume, setVolume] = useState(75);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const isFav = currentSong ? isFavorite(currentSong._id) : false;

	useEffect(() => {
		audioRef.current = document.querySelector("audio");

		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);

		const handleEnded = () => {
			usePlayerStore.setState({ isPlaying: false });
		};

		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [currentSong]);

	const handleSeek = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
		}
	};

	return (
		<footer className='relative h-24 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4 select-none'>
			{/* Mobile seek bar at the very top of the playbar */}
			<div className='block sm:hidden absolute top-0 left-0 right-0 px-2 z-10'>
				<Slider
					value={[currentTime]}
					max={duration || 100}
					step={1}
					className='w-full hover:cursor-grab active:cursor-grabbing'
					onValueChange={handleSeek}
				/>
			</div>
			{/* Mobile time display */}
			<div className='block sm:hidden absolute top-2 right-3 z-10 flex gap-1 text-[9px] text-zinc-500 font-mono'>
				<span>{formatTime(currentTime)}</span>
				<span>/</span>
				<span>{formatTime(duration)}</span>
			</div>

			<div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
				{/* currently playing song */}
				<div className='flex items-center gap-3 sm:gap-4 min-w-[150px] sm:min-w-[220px] w-[35%] sm:w-[30%]'>
					{currentSong && (
						<>
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className='w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md flex-shrink-0 border border-white/5 shadow-md'
							/>
							<div className='flex-1 min-w-0'>
								<div className='font-medium text-xs sm:text-sm truncate hover:underline cursor-pointer text-white'>
									{currentSong.title}
								</div>
								<div className='text-[10px] sm:text-xs text-zinc-400 truncate hover:underline cursor-pointer mt-0.5'>
									{currentSong.artist}
								</div>
							</div>
							<SignedIn>
								<Button
									size="icon"
									variant="ghost"
									className={cn(
										"hover:text-white transition-all h-8 w-8 rounded-full",
										isFav ? "text-green-500 hover:text-green-400" : "text-zinc-400"
									)}
									onClick={() => toggleFavorite(currentSong)}
								>
									<Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", isFav && "fill-green-500 text-green-500")} />
								</Button>
							</SignedIn>
						</>
					)}
				</div>

				{/* player controls*/}
				<div className='flex flex-col items-center gap-1.5 flex-1 max-w-[50%] sm:max-w-[45%]'>
					<div className='flex items-center gap-3 sm:gap-6'>
						<Button
							size='icon'
							variant='ghost'
							className='hidden sm:inline-flex hover:text-white text-zinc-400'
						>
							<Shuffle className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400 h-8 w-8 sm:h-10 sm:w-10'
							onClick={playPrevious}
							disabled={!currentSong}
						>
							<SkipBack className='h-4 w-4 sm:h-5 sm:w-5' />
						</Button>

						<Button
							size='icon'
							className='bg-white hover:bg-white/85 text-black rounded-full h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center'
							onClick={togglePlay}
							disabled={!currentSong}
						>
							{isPlaying ? <Pause className='h-4 w-4 sm:h-5 sm:w-5 text-black fill-black' /> : <Play className='h-4 w-4 sm:h-5 sm:w-5 text-black fill-black ml-0.5' />}
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400 h-8 w-8 sm:h-10 sm:w-10'
							onClick={playNext}
							disabled={!currentSong}
						>
							<SkipForward className='h-4 w-4 sm:h-5 sm:w-5' />
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='hidden sm:inline-flex hover:text-white text-zinc-400'
						>
							<Repeat className='h-4 w-4' />
						</Button>
					</div>

					{/* Desktop seek bar */}
					<div className='hidden sm:flex items-center gap-2 w-full'>
						<div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
						<Slider
							value={[currentTime]}
							max={duration || 100}
							step={1}
							className='w-full hover:cursor-grab active:cursor-grabbing'
							onValueChange={handleSeek}
						/>
						<div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
					</div>
				</div>

				{/* volume and options controls */}
				<div className='flex items-center gap-2 sm:gap-4 min-w-[40px] sm:min-w-[180px] w-[20%] sm:w-[30%] justify-end'>
					<Button
						onClick={toggleLyrics}
						disabled={!currentSong}
						size='icon'
						variant='ghost'
						className={`hover:text-white transition-all h-8 w-8 sm:h-10 sm:w-10 ${showLyrics ? "text-green-500 hover:text-green-400 scale-105" : "text-zinc-400"}`}
						title="Lyrics"
					>
						<Mic2 className='h-4 w-4 sm:h-5 sm:w-5' />
					</Button>
					<Button
						size='icon'
						variant='ghost'
						disabled={!currentSong}
						onClick={toggleFloatingArtwork}
						title='Now Playing'
						className={`hidden sm:inline-flex transition-all h-9 w-9 ${showFloatingArtwork ? "text-green-500 hover:text-green-400 scale-105" : "hover:text-white text-zinc-400"}`}
					>
						<Laptop2 className='h-4 w-4' />
					</Button>
					<div className='hidden sm:flex items-center gap-2'>
						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
							<Volume1 className='h-4 w-4' />
						</Button>

						<Slider
							value={[volume]}
							max={100}
							step={1}
							className='w-24 hover:cursor-grab active:cursor-grabbing'
							onValueChange={(value) => {
								setVolume(value[0]);
								if (audioRef.current) {
									audioRef.current.volume = value[0] / 100;
								}
							}}
						/>
					</div>
				</div>
			</div>
		</footer>
	);
};
