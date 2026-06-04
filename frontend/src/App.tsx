import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import PlaylistPage from "./pages/playlist/PlaylistPage";
import LikedSongsPage from "./pages/playlist/LikedSongsPage";
import SongDetailPage from "./pages/song/SongDetailPage";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	return (
		<>
			<Routes>
				<Route
					path='/sso-callback'
					element={
						<AuthenticateWithRedirectCallback
							signUpForceRedirectUrl={"/auth-callback"}
							signInForceRedirectUrl={"/auth-callback"}
						/>
					}
				/>
				<Route path='/auth-callback' element={<AuthCallbackPage />} />
				<Route path='/signin' element={<SignInPage />} />
				<Route path='/signup' element={<SignUpPage />} />

				<Route path='/' element={<MainLayout />}>
					<Route index element={<HomePage />} />
					<Route
						path='chat'
						element={
							<ProtectedRoute>
								<ChatPage />
							</ProtectedRoute>
						}
					/>
					<Route path='albums/:albumId' element={<AlbumPage />} />
					<Route
						path='playlists/:playlistId'
						element={
							<ProtectedRoute>
								<PlaylistPage />
							</ProtectedRoute>
						}
					/>
					<Route
						path='liked-songs'
						element={
							<ProtectedRoute>
								<LikedSongsPage />
							</ProtectedRoute>
						}
					/>
					<Route path='songs/:songId' element={<SongDetailPage />} />
				</Route>

				<Route
					path='/admin'
					element={
						<ProtectedRoute>
							<AdminPage />
						</ProtectedRoute>
					}
				/>

				<Route path='*' element={<NotFoundPage />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
