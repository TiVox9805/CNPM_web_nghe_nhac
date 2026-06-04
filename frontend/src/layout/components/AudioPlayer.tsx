import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";
import { axiosInstance } from "@/lib/axios";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);
	const playTrackedRef = useRef<boolean>(false);

	const { currentSong, isPlaying, playNext, repeatMode } = usePlayerStore();

	// helper to increment play count once
	const handlePlayIncrement = () => {
		if (!playTrackedRef.current && currentSong) {
			playTrackedRef.current = true;
			axiosInstance.post(`/songs/${currentSong._id}/play`).catch((err) => {
				console.error("Failed to increment play count:", err);
			});
		}
	};

	// handle play/pause logic
	useEffect(() => {
		if (isPlaying) audioRef.current?.play();
		else audioRef.current?.pause();
	}, [isPlaying]);

	// handle song ends and active listening updates
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => {
			handlePlayIncrement();
			if (repeatMode === "one") {
				audio.currentTime = 0;
				audio.play().catch((err) => console.error("Error replaying song:", err));
			} else {
				playNext();
			}
		};

		const handleTimeUpdate = () => {
			const duration = audio.duration;
			if (
				audio.currentTime >= 30 ||
				(duration && duration < 30 && audio.currentTime >= duration - 1)
			) {
				handlePlayIncrement();
			}
		};

		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("timeupdate", handleTimeUpdate);

		return () => {
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("timeupdate", handleTimeUpdate);
		};
	}, [playNext, currentSong, repeatMode]);

	// handle song changes
	useEffect(() => {
		if (!audioRef.current || !currentSong) return;

		const audio = audioRef.current;

		// check if this is actually a new song
		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
		if (isSongChange) {
			audio.src = currentSong?.audioUrl;
			// reset the playback position
			audio.currentTime = 0;

			prevSongRef.current = currentSong?.audioUrl;
			playTrackedRef.current = false; // reset tracking for new song

			if (isPlaying) audio.play();
		}
	}, [currentSong, isPlaying]);

	return <audio ref={audioRef} />;
};
export default AudioPlayer;
