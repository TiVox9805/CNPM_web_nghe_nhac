import { usePlayerStore } from "@/stores/usePlayerStore";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const LyricsOverlay = () => {
	const { currentSong, showLyrics, toggleLyrics } = usePlayerStore();

	if (!showLyrics) return null;

	return (
		<div className='absolute inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col p-6 sm:p-10 select-none animation-fade-in'>
			{/* Close button */}
			<div className='flex justify-end mb-4'>
				<Button
					onClick={toggleLyrics}
					variant='ghost'
					size='icon'
					className='rounded-full text-zinc-400 hover:text-white hover:bg-white/10 w-12 h-12'
				>
					<X className='h-6 w-6' />
				</Button>
			</div>

			{/* Main Lyrics Container */}
			<div className='flex-1 flex flex-col justify-center items-center max-w-3xl mx-auto w-full text-center'>
				{currentSong ? (
					<>
						{/* Song Info Header */}
						<div className='mb-8 sm:mb-12'>
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className='w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-lg shadow-2xl mx-auto mb-4 border border-white/10'
							/>
							<h2 className='text-xl sm:text-2xl font-bold text-white'>{currentSong.title}</h2>
							<p className='text-sm sm:text-base text-green-500 font-medium mt-1'>{currentSong.artist}</p>
						</div>

						{/* Lyrics Scroll Content */}
						<ScrollArea className='flex-1 w-full max-h-[50vh] pr-4'>
							<div className='text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-200/90 leading-relaxed whitespace-pre-line tracking-tight space-y-4 px-2'>
								{currentSong.lyrics ? (
									currentSong.lyrics
								) : (
									<div className='text-zinc-500 text-lg sm:text-xl font-medium italic mt-10'>
										No lyrics available for this song.
									</div>
								)}
							</div>
						</ScrollArea>
					</>
				) : (
					<div className='text-zinc-400 text-lg'>Select a song to view lyrics</div>
				)}
			</div>
		</div>
	);
};

export default LyricsOverlay;
