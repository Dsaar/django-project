// src/components/Navbar.jsx
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
	Drawer,
	List,
	ListItemButton,
	ListItemText,
	Divider,
	InputAdornment,
	useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "@mui/material/styles";

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const theme = useTheme();
	const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

	const [tagQuery, setTagQuery] = useState("");
	const [drawerOpen, setDrawerOpen] = useState(false);

	// ✅ same fields that work in your app
	const avatarUrl = user?.profile?.avatar_url || "";
	const displayName = user?.profile?.display_name || user?.username || "Account";

	const runTagSearch = () => {
		const t = tagQuery.trim();
		if (!t) {
			navigate("/articles");
			return;
		}
		navigate(`/articles?tag=${encodeURIComponent(t)}`);
		// optional UX:
		// setTagQuery("");
	};

	const handleLogout = () => {
		logout();
		if (location.pathname === "/profile") navigate("/");
	};

	const closeDrawer = () => setDrawerOpen(false);

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
				{/* Brand */}
				<Typography
					component={RouterLink}
					to="/"
					sx={{
						color: "inherit",
						textDecoration: "none",
						fontWeight: 800,
						letterSpacing: 0.3,
						whiteSpace: "nowrap",
					}}
					variant="h6"
				>
					Wander Notes
				</Typography>

				<Box sx={{ flex: 1 }} />

				{/* ✅ Desktop search */}
				{isMdUp && (
					<Box
						component="form"
						onSubmit={(e) => {
							e.preventDefault();
							runTagSearch();
						}}
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							width: 360,
							maxWidth: "40vw",
						}}
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
				)}

				{/* ✅ Desktop links */}
				{isMdUp ? (
					<>
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
										<Avatar src={avatarUrl} alt={displayName} sx={{ width: 28, height: 28 }} />
										<Typography sx={{ fontWeight: 700, maxWidth: 160 }} noWrap>
											{displayName}
										</Typography>
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
					</>
				) : (
					/* ✅ Mobile actions: search icon + menu */
					<>
						<IconButton
							color="inherit"
							aria-label="search"
							onClick={() => {
								// On mobile we’ll just open the drawer and focus the search there
								setDrawerOpen(true);
							}}
						>
							<SearchIcon />
						</IconButton>

						<IconButton color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
							<MenuIcon />
						</IconButton>
					</>
				)}
			</Toolbar>

			{/* ✅ Mobile Drawer */}
			<Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
				<Box sx={{ width: 320, p: 2 }} role="presentation">
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
						<Stack direction="row" spacing={1} alignItems="center">
							{user?.isAuthenticated && <Avatar src={avatarUrl} alt={displayName} />}
							<Typography sx={{ fontWeight: 900 }}>
								{user?.isAuthenticated ? displayName : "Menu"}
							</Typography>
						</Stack>

						<IconButton onClick={closeDrawer}>
							<CloseIcon />
						</IconButton>
					</Box>

					{/* Mobile Search */}
					<Box
						component="form"
						onSubmit={(e) => {
							e.preventDefault();
							runTagSearch();
							closeDrawer();
						}}
						sx={{ mb: 2 }}
					>
						<TextField
							size="small"
							value={tagQuery}
							onChange={(e) => setTagQuery(e.target.value)}
							placeholder="Filter by tag (e.g. santorini)"
							fullWidth
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											edge="end"
											onClick={() => {
												runTagSearch();
												closeDrawer();
											}}
											aria-label="search"
										>
											<SearchIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>

					<Divider sx={{ mb: 1 }} />

					<List disablePadding>
						<ListItemButton
							onClick={() => {
								navigate("/articles");
								closeDrawer();
							}}
						>
							<ListItemText primary="Articles" />
						</ListItemButton>

						{user?.isAuthenticated && (
							<ListItemButton
								onClick={() => {
									navigate("/profile");
									closeDrawer();
								}}
							>
								<ListItemText primary="Profile" />
							</ListItemButton>
						)}

						<Divider sx={{ my: 1 }} />

						{authLinks.map((item) => (
							<ListItemButton
								key={item.label}
								onClick={() => {
									if (item.to) navigate(item.to);
									if (item.action) item.action();
									closeDrawer();
								}}
							>
								<ListItemText primary={item.label} />
							</ListItemButton>
						))}
					</List>
				</Box>
			</Drawer>
		</AppBar>
	);
}
