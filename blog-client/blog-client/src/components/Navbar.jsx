import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<AppBar position="sticky" elevation={1}>
			<Toolbar>
				<Typography
					variant="h6"
					component={RouterLink}
					to="/"
					sx={{ color: "inherit", textDecoration: "none", fontWeight: 700 }}
				>
					Blog Management
				</Typography>

				<Box sx={{ flexGrow: 1 }} />

				<Button color="inherit" component={RouterLink} to="/articles">
					Articles
				</Button>

				{!user.isAuthenticated ? (
					<>
						<Button color="inherit" component={RouterLink} to="/login">
							Login
						</Button>
						<Button color="inherit" component={RouterLink} to="/register">
							Register
						</Button>
					</>
				) : (
					<>
						<Typography sx={{ mx: 2, opacity: 0.9 }}>{user.username || "Logged in"}</Typography>
						<Button color="inherit" onClick={handleLogout}>
							Logout
						</Button>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
}
