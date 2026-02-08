import {
	AppBar,
	Toolbar,
	Box,
	IconButton,
	useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "@mui/material/styles";
import logo from "../assets/wandernotes-logo.png";

import Brand from "./navbar/Brand";
import DesktopSearch from "./navbar/DesktopSearch";
import DesktopLinks from "./navbar/DesktopLinks";
import MobileDrawer from "./navbar/MobileDrawer";

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const theme = useTheme();
	const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

	const [tagQuery, setTagQuery] = useState("");
	const [drawerOpen, setDrawerOpen] = useState(false);

	// same fields that work in your app
	const avatarUrl = user?.profile?.avatar_url || "";
	const displayName = user?.profile?.display_name || user?.username || "Account";

	const runTagSearch = useCallback(() => {
		const t = tagQuery.trim();
		if (!t) {
			navigate("/articles");
			return;
		}
		navigate(`/articles?tag=${encodeURIComponent(t)}`);
	}, [tagQuery, navigate]);

	const handleLogout = useCallback(() => {
		logout();
		if (location.pathname === "/profile") navigate("/");
	}, [logout, location.pathname, navigate]);

	const authLinks = useMemo(() => {
		if (user?.isAuthenticated) {
			return [
				{ label: "Profile", to: "/profile" },
				{ label: "Logout", action: handleLogout },
			];
		}
		return [
			{ label: "Login", to: "/login" },
			{ label: "Register", to: "/register" },
		];
	}, [user?.isAuthenticated, handleLogout]);

	return (
		<AppBar position="sticky" elevation={0}>
			<Toolbar sx={{ gap: 1.5 }}>
				<Brand logo={logo} />

				<Box sx={{ flex: 1 }} />

				{/* Desktop search */}
				{isMdUp && (
					<DesktopSearch
						tagQuery={tagQuery}
						setTagQuery={setTagQuery}
						onSearch={runTagSearch}
					/>
				)}

				{/* Desktop links or Mobile menu */}
				{isMdUp ? (
					<DesktopLinks
						user={user}
						avatarUrl={avatarUrl}
						displayName={displayName}
						onLogout={handleLogout}
					/>
				) : (
					<IconButton
						color="inherit"
						aria-label="menu"
						onClick={() => setDrawerOpen(true)}
					>
						<MenuIcon />
					</IconButton>
				)}
			</Toolbar>

			{/* Mobile Drawer */}
			<MobileDrawer
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				user={user}
				avatarUrl={avatarUrl}
				displayName={displayName}
				tagQuery={tagQuery}
				setTagQuery={setTagQuery}
				onSearch={runTagSearch}
				onNavigate={(to) => navigate(to)}
				authLinks={authLinks}
			/>
		</AppBar>
	);
}
