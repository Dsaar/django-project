import { Button, Avatar, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function DesktopLinks({ user, avatarUrl, displayName, onLogout }) {
	return (
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
							<Avatar src={avatarUrl} alt={displayName} sx={{ width: 40, height: 40 }} />
							<Typography sx={{ fontWeight: 700, maxWidth: 160 }} noWrap>
								{displayName}
							</Typography>
						</Stack>
					</Button>

					<Button color="inherit" onClick={onLogout}>
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
	);
}
