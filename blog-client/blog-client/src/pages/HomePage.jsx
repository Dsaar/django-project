import { useEffect, useState } from "react";
import { Typography, Stack, Button, Alert } from "@mui/material";
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
		<>
			<Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
				Latest Articles
			</Typography>

			{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

			<Stack spacing={2}>
				{items.map((a) => (
					<ArticleCard key={a.id} article={a} />
				))}
			</Stack>

			<Button component={RouterLink} to="/articles" sx={{ mt: 3 }} variant="contained">
				View more articles
			</Button>
		</>
	);
}
