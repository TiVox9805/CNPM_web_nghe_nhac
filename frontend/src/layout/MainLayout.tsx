import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import LyricsOverlay from "./components/LyricsOverlay";
import FloatingArtwork from "./components/FloatingArtwork";
import { useEffect, useState } from "react";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			if (window.innerWidth > 0) {
				setIsMobile(window.innerWidth < 768);
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<div className='h-screen bg-black text-white flex flex-col relative overflow-hidden'>
			<LyricsOverlay />
			<div className='hidden sm:block'>
				<FloatingArtwork />
			</div>
			<ResizablePanelGroup 
				direction='horizontal' 
				autoSaveId='music-app-layout' 
				className='flex-1 flex h-full overflow-hidden p-2'
			>
				<AudioPlayer />
				{/* left sidebar */}
				<ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
					<LeftSidebar />
				</ResizablePanel>

				<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

				{/* Main content */}
				<ResizablePanel defaultSize={isMobile ? 80 : 60}>
					<Outlet />
				</ResizablePanel>

				{!isMobile && (
					<>
						<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

						{/* right sidebar */}
						<ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
							<FriendsActivity />
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>

			<PlaybackControls />
		</div>
	);
};
export default MainLayout;
