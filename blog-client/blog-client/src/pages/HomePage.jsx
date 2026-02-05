import { useEffect, useState } from "react";
import {
	Typography,
	Stack,
	Button,
	Alert,
	Paper,
	Box,
	Container,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fetchLatestArticles } from "../services/articles";
import ArticleCard from "../components/ArticleCard";

export default function HomePage() {
	const [items, setItems] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchLatestArticles()
			.then(setItems)
			.catch(() => setError("Failed to load latest articles."));
	}, []);

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* HERO */}
			<Paper
				variant="outlined"
				sx={{
					p: { xs: 3, md: 5 },
					mb: 4,
					borderRadius: 4,
					background:
						"linear-gradient(135deg, rgba(31,111,120,0.12), rgba(224,122,95,0.12))",
				}}
			>
				<Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
					Wander Notes
				</Typography>

				<Typography color="text.secondary" sx={{ maxWidth: 720 }}>
					Stories, guides, and photo-driven travel diaries — built with Django + React.
				</Typography>

				<Box sx={{ mt: 2 }}>
					<Button component={RouterLink} to="/articles" variant="contained">
						Explore all posts
					</Button>
				</Box>
			</Paper>

			{/* LATEST */}
			<Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
				Latest stories
			</Typography>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Stack spacing={3}>
				{items.map((a) => (
					<ArticleCard key={a.id} article={a} />
				))}
			</Stack>
		</Container>
	);
}
