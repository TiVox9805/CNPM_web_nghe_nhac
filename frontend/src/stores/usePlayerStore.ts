import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	showLyrics: boolean;
	showFloatingArtwork: boolean;
	isShuffled: boolean;
	repeatMode: "off" | "all" | "one";

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	toggleLyrics: () => void;
	toggleFloatingArtwork: () => void;
	toggleShuffle: () => void;
	toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	showLyrics: false,
	showFloatingArtwork: true,
	isShuffled: false,
	repeatMode: "off",

	toggleLyrics: () => set({ showLyrics: !get().showLyrics }),
	toggleFloatingArtwork: () => set({ showFloatingArtwork: !get().showFloatingArtwork }),
	toggleShuffle: () => set({ isShuffled: !get().isShuffled }),
	toggleRepeat: () => {
		const currentMode = get().repeatMode;
		const modes: ("off" | "all" | "one")[] = ["off", "all", "one"];
		const nextIndex = (modes.indexOf(currentMode) + 1) % modes.length;
		set({ repeatMode: modes[nextIndex] });
	},

	initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];

		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}
		set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
		});
	},

	setCurrentSong: (song: Song | null) => {
		if (!song) return;

		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		const songIndex = get().queue.findIndex((s) => s._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});
	},

	togglePlay: () => {
		const willStartPlaying = !get().isPlaying;

		const currentSong = get().currentSong;
		const socket = useChatStore.getState().socket;
		if (socket.auth) {
			socket.emit("update_activity", {
				userId: socket.auth.userId,
				activity:
					willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
			});
		}

		set({
			isPlaying: willStartPlaying,
		});
	},

	playNext: () => {
		const { currentIndex, queue, isShuffled, repeatMode } = get();
		if (queue.length === 0) return;

		let nextIndex = -1;

		if (isShuffled && queue.length > 1) {
			let rand = currentIndex;
			while (rand === currentIndex) {
				rand = Math.floor(Math.random() * queue.length);
			}
			nextIndex = rand;
		} else {
			nextIndex = currentIndex + 1;
		}

		if (nextIndex < queue.length && nextIndex >= 0) {
			const nextSong = queue[nextIndex];

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
				});
			}

			set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
			});
		} else {
			if (repeatMode === "all") {
				const nextSong = queue[0];
				const socket = useChatStore.getState().socket;
				if (socket.auth) {
					socket.emit("update_activity", {
						userId: socket.auth.userId,
						activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
					});
				}
				set({
					currentSong: nextSong,
					currentIndex: 0,
					isPlaying: true,
				});
			} else {
				set({ isPlaying: false });

				const socket = useChatStore.getState().socket;
				if (socket.auth) {
					socket.emit("update_activity", {
						userId: socket.auth.userId,
						activity: `Idle`,
					});
				}
			}
		}
	},
	playPrevious: () => {
		const { currentIndex, queue, isShuffled, repeatMode } = get();
		if (queue.length === 0) return;

		let prevIndex = -1;

		if (isShuffled && queue.length > 1) {
			let rand = currentIndex;
			while (rand === currentIndex) {
				rand = Math.floor(Math.random() * queue.length);
			}
			prevIndex = rand;
		} else {
			prevIndex = currentIndex - 1;
		}

		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];

			const socket = useChatStore.getState().socket;
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
				});
			}

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
		} else {
			if (repeatMode === "all") {
				const lastIndex = queue.length - 1;
				const prevSong = queue[lastIndex];
				const socket = useChatStore.getState().socket;
				if (socket.auth) {
					socket.emit("update_activity", {
						userId: socket.auth.userId,
						activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
					});
				}
				set({
					currentSong: prevSong,
					currentIndex: lastIndex,
					isPlaying: true,
				});
			} else {
				set({ isPlaying: false });

				const socket = useChatStore.getState().socket;
				if (socket.auth) {
					socket.emit("update_activity", {
						userId: socket.auth.userId,
						activity: `Idle`,
					});
				}
			}
		}
	},
}));
