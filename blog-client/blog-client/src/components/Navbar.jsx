// Navbar.jsx
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

function buildArticlesSearchUrl(raw) {
	const t = raw.trim();
	if (!t) return "/articles";

	// tag mode: "#travel" OR "tag:travel"
	if (t.startsWith("#")) {
		const tag = t.slice(1).trim();
		return tag ? `/articles?tag=${encodeURIComponent(tag)}` : "/articles";
	}
	if (t.toLowerCase().startsWith("tag:")) {
		const tag = t.slice(4).trim();
		return tag ? `/articles?tag=${encodeURIComponent(tag)}` : "/articles";
	}

	// full-text mode
	return `/articles?search=${encodeURIComponent(t)}`;
}

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const theme = useTheme();
	const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

	const [query, setQuery] = useState("");
	const [drawerOpen, setDrawerOpen] = useState(false);

	const avatarUrl = user?.profile?.avatar_url || "";
	const displayName = user?.profile?.display_name || user?.username || "Account";

	const runSearch = useCallback(() => {
		navigate(buildArticlesSearchUrl(query));
	}, [query, navigate]);

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

				{isMdUp && (
					<DesktopSearch
						tagQuery={query}
						setTagQuery={setQuery}
						onSearch={runSearch}
					/>
				)}

				{isMdUp ? (
					<DesktopLinks
						user={user}
						avatarUrl={avatarUrl}
						displayName={displayName}
						onLogout={handleLogout}
					/>
				) : (
					<IconButton color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
						<MenuIcon />
					</IconButton>
				)}
			</Toolbar>

			<MobileDrawer
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				user={user}
				avatarUrl={avatarUrl}
				displayName={displayName}
				tagQuery={query}
				setTagQuery={setQuery}
				onSearch={runSearch}
				onNavigate={(to) => navigate(to)}
				authLinks={authLinks}
			/>
		</AppBar>
	);
}
