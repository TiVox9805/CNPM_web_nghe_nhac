import { useAuth } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
	children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
	const { isLoaded, isSignedIn } = useAuth();

	if (!isLoaded) {
		return (
			<div className='h-screen w-full flex items-center justify-center bg-black'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500'></div>
			</div>
		);
	}

	if (!isSignedIn) {
		return <Navigate to='/signin' replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
