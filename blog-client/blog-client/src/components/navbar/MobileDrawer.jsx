import {
	Box,
	Drawer,
	Stack,
	Avatar,
	Typography,
	IconButton,
	TextField,
	InputAdornment,
	Divider,
	List,
	ListItemButton,
	ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export default function MobileDrawer({
	open,
	onClose,
	user,
	avatarUrl,
	displayName,
	tagQuery,
	setTagQuery,
	onSearch,
	onNavigate,
	authLinks,
}) {
	return (
		<Drawer anchor="right" open={open} onClose={onClose}>
			<Box sx={{ width: 320, p: 2 }} role="presentation">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						mb: 1,
					}}
				>
					<Stack direction="row" spacing={1} alignItems="center">
						{user?.isAuthenticated && <Avatar src={avatarUrl} alt={displayName} />}
						<Typography sx={{ fontWeight: 900 }}>
							{user?.isAuthenticated ? displayName : "Menu"}
						</Typography>
					</Stack>

					<IconButton onClick={onClose}>
						<CloseIcon />
					</IconButton>
				</Box>

				{/* Mobile Search */}
				<Box
					component="form"
					onSubmit={(e) => {
						e.preventDefault();
						onSearch();
						onClose();
					}}
					sx={{ mb: 2 }}
				>
					<TextField
						size="small"
						value={tagQuery}
						onChange={(e) => setTagQuery(e.target.value)}
						placeholder="Search..."
						fullWidth
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										edge="end"
										onClick={() => {
											onSearch();
											onClose();
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
							onNavigate("/articles");
							onClose();
						}}
					>
						<ListItemText primary="Articles" />
					</ListItemButton>

					{user?.isAuthenticated && (
						<ListItemButton
							onClick={() => {
								onNavigate("/profile");
								onClose();
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
								if (item.to) onNavigate(item.to);
								if (item.action) item.action();
								onClose();
							}}
						>
							<ListItemText primary={item.label} />
						</ListItemButton>
					))}
				</List>
			</Box>
		</Drawer>
	);
}
