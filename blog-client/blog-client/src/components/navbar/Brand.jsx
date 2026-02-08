import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Brand({ logo, alt = "Wander Notes" }) {
	return (
		<Box
			component={RouterLink}
			to="/"
			sx={{
				display: "flex",
				alignItems: "center",
				textDecoration: "none",
			}}
		>
			<Box
				component="img"
				src={logo}
				alt={alt}
				sx={{
					height: { xs: 36, sm: 42, md: 90 },
					width: "auto",
					display: "block",
				}}
			/>
		</Box>
	);
}
