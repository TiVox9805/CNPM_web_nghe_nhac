import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId } = useAuth();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();

	useEffect(() => {
		// Set up dynamic interceptor to attach/refresh the token for every request
		const interceptor = axiosInstance.interceptors.request.use(
			async (config) => {
				try {
					const token = await getToken();
					if (token) {
						config.headers.Authorization = `Bearer ${token}`;
					} else {
						delete config.headers.Authorization;
					}
				} catch (error) {
					console.error("Error fetching auth token in interceptor:", error);
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		const initAuth = async () => {
			try {
				const token = await getToken();
				if (token) {
					await checkAdminStatus();
					// init socket
					if (userId) initSocket(userId);
				}
			} catch (error: any) {
				console.log("Error in auth provider:", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => {
			axiosInstance.interceptors.request.eject(interceptor);
			disconnectSocket();
		};
	}, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
