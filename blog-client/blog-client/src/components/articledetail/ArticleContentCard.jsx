import { Paper, Box } from "@mui/material";
import ArticleHero from "./ArticleHero";
import ArticleBody from "./ArticleBody";

export default function ArticleContentCard({ article }) {
	return (
		<Paper
			variant="outlined"
			sx={{
				overflow: "hidden",
				borderRadius: 3,
				mb: 3,
			}}
		>
			<ArticleHero article={article} />

			<Box sx={{ p: { xs: 2.5, md: 3 } }}>
				<ArticleBody article={article} />
			</Box>
		</Paper>
	);
}
