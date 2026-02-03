import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchArticles } from "../services/articles";
import ArticleCard from "../components/ArticleCard";
import { Container, Grid, Typography, Alert, Stack, Chip, Button } from "@mui/material";

export default function ArticlesPage() {
	const [searchParams, setSearchParams] = useSearchParams();

	// URL is: /articles?tag=something
	const tag = useMemo(() => (searchParams.get("tag") || "").trim(), [searchParams]);

	const [articles, setArticles] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		(async () => {
			setError("");
			try {
				const params = tag ? { "tags__name": tag } : {};
				const items = await fetchArticles(params);
				setArticles(items);
			} catch (e) {
				setError("Failed to load articles.");
				setArticles([]);
			}
		})();
	}, [tag]);

	const clearFilter = () => {
		searchParams.delete("tag");
		setSearchParams(searchParams);
	};

	return (
		<Container sx={{ py: 4 }}>
			<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
				<Typography variant="h4" sx={{ flex: 1 }}>
					{tag ? `Articles tagged: ${tag}` : "All Articles"}
				</Typography>

				{tag && (
					<>
						<Chip label={`#${tag}`} onDelete={clearFilter} />
						<Button variant="outlined" onClick={clearFilter}>
							Clear
						</Button>
					</>
				)}
			</Stack>

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
