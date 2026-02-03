import {
	Card,
	CardContent,
	Typography,
	CardActions,
	Button,
	Chip,
	Stack,
	CardMedia,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function ArticleCard({ article }) {
	if (!article) return null;

	const img = article.image_url || article.image || null;

	return (
		<Card variant="outlined" sx={{ overflow: "hidden" }}>
			{img && (
				<CardMedia
					component="img"
					height="180"
					image={img}
					alt={article.title}
					sx={{ objectFit: "cover" }}
				/>
			)}

			<CardContent>
				<Typography variant="h6" sx={{ fontWeight: 800 }}>
					{article.title}
				</Typography>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					By {article.author_name} •{" "}
					{article.published_at ? new Date(article.published_at).toLocaleDateString() : ""}
				</Typography>

				<Typography variant="body1" sx={{ mb: 2 }}>
					{article.content?.slice(0, 160)}
					{article.content?.length > 160 ? "…" : ""}
				</Typography>

				<Stack direction="row" spacing={1} flexWrap="wrap">
					{(article.tags || []).map((t) => (
						<Chip key={t.id} label={t.name} size="small" sx={{ mb: 1 }} />
					))}
				</Stack>
			</CardContent>

			<CardActions>
				<Button size="small" component={RouterLink} to={`/articles/${article.id}`}>
					Read more
				</Button>
			</CardActions>
		</Card>
	);
}
