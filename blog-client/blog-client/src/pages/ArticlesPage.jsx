import { useEffect, useState } from "react";
import { fetchArticles } from "../services/articles";
import ArticleCard from "../components/ArticleCard";
import { Container, Grid, Typography, Alert } from "@mui/material";

export default function ArticlesPage() {
	const [articles, setArticles] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		(async () => {
			try {
				const items = await fetchArticles();
				setArticles(items);
			} catch (e) {
				console.error("Articles load failed:", e);
				setError("Failed to load articles. Check API base URL / server.");
			}
		})();
	}, []);

	return (
		<Container sx={{ py: 4 }}>
			<Typography variant="h4" sx={{ mb: 2 }}>
				All Articles
			</Typography>

			{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

			<Grid container spacing={2}>
				{articles.map((a) => (
					<Grid item xs={12} md={6} key={a.id}>
						<ArticleCard article={a} />
					</Grid>
				))}
			</Grid>
		</Container>
	);
}
