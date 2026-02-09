// src/components/articledetail/ArticleHero.jsx
import { Box, Paper, Stack, Typography, Avatar, Chip, Divider } from "@mui/material";

const FALLBACK_IMG =
	"https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60";
const FALLBACK_AVATAR = "https://i.pravatar.cc/100";

export default function ArticleHero({ article, dateText, content }) {
	const heroImg = article?.image_url || FALLBACK_IMG;
	const authorName = article?.author_name || "Traveler";
	const authorAvatar = article?.author_avatar_url || FALLBACK_AVATAR;
	const tags = Array.isArray(article?.tags) ? article.tags : [];

	return (
		<Paper variant="outlined" sx={{ overflow: "hidden", borderRadius: 3, mb: 3 }}>
			{/* image */}
			<Box
				sx={{
					width: "100%",
					aspectRatio: "16 / 6",
					bgcolor: "grey.200",
					backgroundImage: `url(${heroImg})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>

			{/* header */}
			<Box sx={{ p: { xs: 2.5, md: 3 } }}>
				<Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
					{article?.title}
				</Typography>

				<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
					<Avatar src={authorAvatar} alt={authorName} sx={{ width: 32, height: 32 }} />
					<Typography variant="body2" sx={{ fontWeight: 700 }}>
						{authorName}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						• {dateText}
					</Typography>
				</Stack>

				{tags.length > 0 && (
					<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
						{tags.map((t) => (
							<Chip key={t.id ?? t.name} label={t.name} size="small" variant="outlined" />
						))}
					</Stack>
				)}
			</Box>

			{/* ✅ body inside same card */}
			<Divider />
			<Box sx={{ p: { xs: 2.5, md: 3 } }}>
				<Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
					{content}
				</Typography>
			</Box>
		</Paper>
	);
}
