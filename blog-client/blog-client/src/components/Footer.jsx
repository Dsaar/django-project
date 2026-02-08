// src/components/Footer.jsx
import { Box, Container, Typography, Stack, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				mt: 6,
				py: 3,
				borderTop: "1px solid",
				borderColor: "divider",
				backgroundColor: "background.paper",
			}}
		>
			<Container maxWidth="lg">
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={2}
					justifyContent="space-between"
					alignItems={{ xs: "flex-start", sm: "center" }}
				>
					<Typography variant="body2" color="text.secondary">
						© {new Date().getFullYear()} Wander Notes
					</Typography>

					<Stack direction="row" spacing={2}>
						<Link component={RouterLink} to="/" underline="hover" color="text.secondary">
							Home
						</Link>
						<Link component={RouterLink} to="/articles" underline="hover" color="text.secondary">
							Articles
						</Link>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}
