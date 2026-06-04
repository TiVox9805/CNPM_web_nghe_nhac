import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";


const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const ChatPage = () => {
	const { user } = useUser();
	const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();
	const navigate = useNavigate();
	const currentSong = usePlayerStore((state) => state.currentSong);
	const isPlaying = usePlayerStore((state) => state.isPlaying);

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.clerkId);
	}, [selectedUser, fetchMessages]);

	console.log({ messages });

	return (
		<main className='h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden'>
			<Topbar />

			<div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]'>
				<UsersList />

				{/* chat message */}
				<div className='flex flex-col h-full'>
					{selectedUser ? (
						<>
							<ChatHeader />

							{/* Messages */}
							<ScrollArea className='h-[calc(100vh-340px)]'>
								<div className='p-4 space-y-4'>
									{messages.map((message) => {
										const contentTrimmed = message.content.trim();
										const isSongShare = contentTrimmed.startsWith("[SONG_SHARE]:");
										let sharedSong = null;
										if (isSongShare) {
											try {
												const jsonPart = contentTrimmed.substring(13).trim();
												sharedSong = JSON.parse(jsonPart);
											} catch (e) {
												console.error("Failed to parse shared song:", e);
											}
										}
										
										const isCurrentPlaying = sharedSong && currentSong?._id === sharedSong._id && isPlaying;

										return (
											<div
												key={message._id}
												className={`flex items-start gap-3 ${message.senderId === user?.id ? "flex-row-reverse" : ""
													}`}
											>
												<Avatar className='size-8'>
													<AvatarImage
														src={
															message.senderId === user?.id
																? user.imageUrl
																: selectedUser.imageUrl
														}
													/>
												</Avatar>

												<div
													className={`rounded-lg p-2 max-w-[75%]
														${message.senderId === user?.id ? "bg-green-500/20 border border-green-500/30 text-white" : "bg-zinc-800/80 border border-zinc-700/50"}
													`}
												>
													{isSongShare && sharedSong ? (
														<div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2 rounded-lg max-w-sm w-full sm:w-64">
															<img
																src={sharedSong.imageUrl}
																alt={sharedSong.title}
																className="w-10 h-10 rounded object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
																onClick={() => navigate(`/songs/${sharedSong._id}`)}
																title="Xem chi tiết bài hát"
															/>
															<div 
																className="flex-1 min-w-0 cursor-pointer" 
																onClick={() => navigate(`/songs/${sharedSong._id}`)}
																title="Xem chi tiết bài hát"
															>
																<div className="text-xs font-semibold truncate text-white hover:underline">{sharedSong.title}</div>
																<div className="text-[10px] text-zinc-400 truncate mt-0.5">{sharedSong.artist}</div>
															</div>
															<button
																onClick={() => {
																	const { currentSong: activeSong, setCurrentSong, togglePlay } = usePlayerStore.getState();
																	if (activeSong?._id === sharedSong._id) {
																		togglePlay();
																	} else {
																		setCurrentSong(sharedSong);
																	}
																}}
																className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 hover:bg-green-400 active:scale-95 transition-all flex items-center justify-center text-black"
																title={isCurrentPlaying ? "Tạm dừng" : "Nghe ngay"}
															>
																{isCurrentPlaying ? (
																	<Pause className="h-3.5 w-3.5 fill-black text-black" />
																) : (
																	<Play className="h-3.5 w-3.5 fill-black text-black ml-0.5" />
																)}
															</button>
														</div>
													) : (
														<p className='text-sm'>{message.content}</p>
													)}
													<span className='text-xs text-zinc-400 mt-1 block'>
														{formatTime(message.createdAt)}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							</ScrollArea>

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};
export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6'>
		<img src='/dreamweaver.png' alt='Dreamweaver' className='size-16 animate-bounce' />
		<div className='text-center'>
			<h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
			<p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
		</div>
	</div>
);
