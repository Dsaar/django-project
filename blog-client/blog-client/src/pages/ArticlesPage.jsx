// src/pages/ArticlesPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchArticles } from "../services/articles";
import ArticleCard from "../components/ArticleCard";
import { Container, Typography, Alert, Box, Stack, Chip, Button } from "@mui/material";

export default function ArticlesPage() {
	const [searchParams, setSearchParams] = useSearchParams();

	// URL is: /articles?tag=something
	const tag = useMemo(() => (searchParams.get("tag") || "").trim(), [searchParams]);

	const [articles, setArticles] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		(async () => {
			try {
				setError("");
				const params = tag ? { "tags__name": tag } : {};
				const items = await fetchArticles(params);
				setArticles(Array.isArray(items) ? items : []);
			} catch {
				setError("Failed to load articles.");
				setArticles([]);
			}
		})();
	}, [tag]);

	const clearFilter = () => {
		const next = new URLSearchParams(searchParams);
		next.delete("tag");
		setSearchParams(next);
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* ✅ Header + active tag filter UI */}
			<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
				<Typography variant="h4" sx={{ flex: 1, fontWeight: 900 }}>
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

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			{/* ✅ Keep your grid */}
			<Box
				sx={{
					display: "grid",
					gap: 3,
					gridTemplateColumns: {
						xs: "1fr",
						sm: "repeat(2, minmax(0, 1fr))",
						md: "repeat(3, minmax(0, 1fr))",
					},
					alignItems: "stretch",
				}}
			>
				{articles.map((a) => (
					<Box key={a.id} sx={{ display: "flex" }}>
						<ArticleCard article={a} />
					</Box>
				))}
			</Box>
		</Container>
	);
}
