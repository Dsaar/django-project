import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	Button,
	TextField,
	IconButton,
	Avatar,
	Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [tagQuery, setTagQuery] = useState("");

	// ✅ Use the SAME fields as the version that worked
	const avatarUrl = user?.profile?.avatar_url || "";
	const displayName = user?.profile?.display_name || user?.username || "Account";

	const runTagSearch = () => {
		const t = tagQuery.trim();
		if (!t) {
			navigate("/articles");
			return;
		}
		navigate(`/articles?tag=${encodeURIComponent(t)}`);
	};

	const onKeyDown = (e) => {
		if (e.key === "Enter") runTagSearch();
	};

	const handleLogout = () => {
		logout();
		// optional UX: if user logs out while on profile, send them home
		if (location.pathname === "/profile") navigate("/");
	};

	return (
		<AppBar position="sticky" elevation={0}>
			<Toolbar sx={{ gap: 2 }}>
				<Typography
					component={RouterLink}
					to="/"
					sx={{
						color: "inherit",
						textDecoration: "none",
						fontWeight: 800,
						letterSpacing: 0.3,
					}}
					variant="h6"
				>
					Wander Notes
				</Typography>

				<Box sx={{ flex: 1 }} />

				{/* Tag search */}
				<Box
					component="form"
					onSubmit={(e) => {
						e.preventDefault();
						runTagSearch();
					}}
					sx={{ display: "flex", alignItems: "center", gap: 1, width: { xs: 180, sm: 260, md: 320 } }}
				>
					<TextField
						size="small"
						value={tagQuery}
						onChange={(e) => setTagQuery(e.target.value)}
						placeholder="Filter by tag (e.g. santorini)"
						fullWidth
						sx={{
							"& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.12)" },
							input: { color: "inherit" },
						}}
					/>
					<IconButton color="inherit" type="submit" aria-label="search">
						<SearchIcon />
					</IconButton>
				</Box>


				<Button color="inherit" component={RouterLink} to="/articles">
					Articles
				</Button>

				{user?.isAuthenticated ? (
					<>
						<Button
							color="inherit"
							component={RouterLink}
							to="/profile"
							sx={{ textTransform: "none", px: 1 }}
						>
							<Stack direction="row" spacing={1} alignItems="center">
								<Avatar
									src={avatarUrl}
									alt={displayName}
									sx={{ width: 28, height: 28 }}
								/>
								<Typography sx={{ fontWeight: 700 }}>{displayName}</Typography>
							</Stack>
						</Button>

						<Button color="inherit" onClick={handleLogout}>
							Logout
						</Button>
					</>
				) : (
					<>
						<Button color="inherit" component={RouterLink} to="/login">
							Login
						</Button>
						<Button color="inherit" component={RouterLink} to="/register">
							Register
						</Button>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
}
