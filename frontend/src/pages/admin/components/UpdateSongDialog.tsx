import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMusicStore } from "@/stores/useMusicStore";
import { Song } from "@/types";
import { Pencil, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface UpdateSongDialogProps {
	song: Song;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const UpdateSongDialog = ({ song, open, onOpenChange }: UpdateSongDialogProps) => {
	const { albums, updateSong, isLoading } = useMusicStore();

	const [form, setForm] = useState({
		title: "",
		artist: "",
		album: "",
		duration: "0",
		lyrics: "",
		genres: "",
	});

	const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({
		audio: null,
		image: null,
	});

	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	// Pre-fill with current song values when dialog opens
	useEffect(() => {
		if (open && song) {
			setForm({
				title: song.title || "",
				artist: song.artist || "",
				album: song.albumId || "none",
				duration: String(song.duration || "0"),
				lyrics: song.lyrics || "",
				genres: (song.genres || []).join(", "),
			});
			setFiles({ audio: null, image: null });
		}
	}, [open, song]);

	const handleSubmit = async () => {
		const formData = new FormData();
		formData.append("title", form.title);
		formData.append("artist", form.artist);
		formData.append("duration", form.duration);
		formData.append("lyrics", form.lyrics);
		formData.append("genres", form.genres);
		formData.append("albumId", form.album === "none" ? "null" : form.album);

		if (files.audio) formData.append("audioFile", files.audio);
		if (files.image) formData.append("imageFile", files.image);

		await updateSong(song._id, formData);
		if (!isLoading) {
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="bg-zinc-900 border-zinc-700 max-h-[85vh] overflow-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Pencil className="h-5 w-5 text-emerald-500" />
						Edit Song
					</DialogTitle>
					<DialogDescription className="text-zinc-400">
						Update information for <span className="text-white font-medium">"{song.title}"</span>. Files are optional — leave blank to keep existing.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Hidden file inputs */}
					<input
						type="file"
						accept="audio/*"
						ref={audioInputRef}
						hidden
						onChange={(e) => setFiles((prev) => ({ ...prev, audio: e.target.files![0] }))}
					/>
					<input
						type="file"
						ref={imageInputRef}
						className="hidden"
						accept="image/*"
						onChange={(e) => setFiles((prev) => ({ ...prev, image: e.target.files![0] }))}
					/>

					{/* Artwork preview + optional replace */}
					<div className="flex gap-4">
						<div
							className="relative group w-24 h-24 rounded-md overflow-hidden border-2 border-dashed border-zinc-700 cursor-pointer flex-shrink-0"
							onClick={() => imageInputRef.current?.click()}
						>
							<img
								src={files.image ? URL.createObjectURL(files.image) : song.imageUrl}
								alt={song.title}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<Upload className="h-5 w-5 text-white" />
								<span className="text-[10px] text-white mt-1">Replace</span>
							</div>
						</div>
						<div className="flex-1 flex flex-col justify-center gap-1">
							<p className="text-sm font-medium text-zinc-200">Cover Image</p>
							<p className="text-xs text-zinc-500">Click the image to replace. Leave as-is to keep current artwork.</p>
							{files.image && (
								<span className="text-xs text-emerald-400 font-medium truncate">
									✓ {files.image.name}
								</span>
							)}
						</div>
					</div>

					{/* Audio replace */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-200">Audio File (Optional — replace only)</label>
						<Button
							type="button"
							variant="outline"
							onClick={() => audioInputRef.current?.click()}
							className="w-full bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white justify-start"
						>
							<Upload className="h-4 w-4 mr-2 text-zinc-500" />
							{files.audio ? (
								<span className="text-emerald-400 truncate">{files.audio.name}</span>
							) : (
								<span className="text-zinc-500">No file selected — keep current audio</span>
							)}
						</Button>
					</div>

					{/* Title */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-200">Title</label>
						<Input
							value={form.title}
							onChange={(e) => setForm({ ...form, title: e.target.value })}
							className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-emerald-500"
						/>
					</div>

					{/* Artist */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-200">Artist</label>
						<Input
							value={form.artist}
							onChange={(e) => setForm({ ...form, artist: e.target.value })}
							className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-emerald-500"
						/>
					</div>


					{/* Genres */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-200">Genres (comma separated)</label>
						<Input
							value={form.genres}
							onChange={(e) => setForm({ ...form, genres: e.target.value })}
							placeholder="Pop, Rock, R&B"
							className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-emerald-500 placeholder:text-zinc-600"
						/>
					</div>

					{/* Album */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-200">Album</label>
						<Select
							value={form.album}
							onValueChange={(value) => setForm({ ...form, album: value })}
						>
							<SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
								<SelectValue placeholder="Select album" />
							</SelectTrigger>
							<SelectContent className="bg-zinc-800 border-zinc-700">
								<SelectItem value="none" className="text-zinc-300">No Album (Single)</SelectItem>
								{albums.map((album) => (
									<SelectItem key={album._id} value={album._id} className="text-zinc-300">
										{album.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Lyrics */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-zinc-200">Lyrics (Optional)</label>
						<textarea
							value={form.lyrics}
							onChange={(e) => setForm({ ...form, lyrics: e.target.value })}
							placeholder="Paste or write song lyrics here..."
							rows={5}
							className="flex min-h-[120px] w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
						/>
					</div>
				</div>

				<DialogFooter className="gap-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isLoading}
						className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isLoading || !form.title || !form.artist}
						className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
					>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateSongDialog;
