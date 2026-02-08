import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AppLayout({ children }) {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Navbar />

			{/* main grows to push footer to bottom when content is short */}
			<Box component="main" sx={{ flex: 1 }}>
				{children}
			</Box>

			<Footer />
		</Box>
	);
}
