export interface Song {
	_id: string;
	title: string;
	artist: string;
	albumId: string | null;
	imageUrl: string;
	audioUrl: string;
	duration: number;
	createdAt: string;
	updatedAt: string;
	genres?: string[];
	lyrics?: string;
	playCount?: number;
}

export interface Album {
	_id: string;
	title: string;
	artist: string;
	imageUrl: string;
	releaseYear: number;
	songs: Song[];
}

export interface Playlist {
	_id: string;
	name: string;
	description?: string;
	imageUrl?: string;
	userId: string;
	songs: Song[];
	createdAt: string;
	updatedAt: string;
}

export interface Favorite {
	_id: string;
	userId: string;
	songId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}

export interface Comment {
	_id: string;
	userId: string | {
		_id: string;
		fullName: string;
		imageUrl: string;
		clerkId: string;
	};
	songId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}