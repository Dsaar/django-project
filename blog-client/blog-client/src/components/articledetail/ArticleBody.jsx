import { Paper, Typography } from "@mui/material";

export default function ArticleBody({ content }) {
	return (
		<Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, mb: 3 }}>
			<Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
				{content}
			</Typography>
		</Paper>
	);
}
