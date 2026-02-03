import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
	const { user, isReady } = useAuth();

	if (!isReady) {
		return (
			<Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (!user?.isAuthenticated) return <Navigate to="/login" replace />;
	return children;
}
