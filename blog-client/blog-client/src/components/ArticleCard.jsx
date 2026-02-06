// src/components/ArticleCard.jsx
import {
	Card,
	CardContent,
	Typography,
	Box,
	Stack,
	Avatar,
	Chip,
	Divider,
	IconButton,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../contexts/AuthContext";
import { canEditArticle, canDeleteArticle } from "../utils/permissions";

const FALLBACK_IMG =
	"https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60";
const FALLBACK_AVATAR = "https://i.pravatar.cc/100";

function formatDate(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ArticleCard({ article, onRequestDelete }) {
	const { user } = useAuth();
	const navigate = useNavigate();

	const id = article?.id;
	const img = article?.image_url || FALLBACK_IMG;

	const authorName = article?.author_name || "Traveler";
	const dateText = formatDate(article?.published_at);
	const tags = Array.isArray(article?.tags) ? article.tags : [];
	const avatarUrl = article?.author_avatar_url || FALLBACK_AVATAR;

	const canEdit = canEditArticle(user, article);
	const canDelete = canDeleteArticle(user, article);

	return (
		<Card
			variant="outlined"
			sx={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: 0,
				overflow: "hidden",
			}}
		>
			{/* Image area is NOT clickable anymore */}
			<Box
				sx={{
					position: "relative",
					width: "100%",
					aspectRatio: "16 / 9",
					bgcolor: "grey.200",
					backgroundImage: `url(${img})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				{(canEdit || canDelete) && (
					<Stack
						direction="row"
						spacing={1}
						sx={{ position: "absolute", top: 8, right: 8 }}
					>
						{canEdit && (
							<IconButton
								size="small"
								onClick={(e) => {
									e.stopPropagation();
									navigate(`/articles/${id}/edit`);
								}}
								sx={{
									bgcolor: "rgba(255,255,255,0.9)",
									"&:hover": { bgcolor: "white" },
								}}
							>
								<EditIcon fontSize="small" />
							</IconButton>
						)}

						{canDelete && (
							<IconButton
								size="small"
								onClick={(e) => {
									e.stopPropagation();
									onRequestDelete?.(article); // ✅ open modal in parent
								}}
								sx={{
									bgcolor: "rgba(255,255,255,0.9)",
									"&:hover": { bgcolor: "white" },
								}}
							>
								<DeleteIcon fontSize="small" />
							</IconButton>
						)}
					</Stack>
				)}
			</Box>

			{/* Only THIS bottom part navigates to the article */}
			<Box
				component={RouterLink}
				to={`/articles/${id}`}
				sx={{
					textDecoration: "none",
					color: "inherit",
					display: "flex",
					flexDirection: "column",
					flexGrow: 1,
				}}
			>
				<CardContent
					sx={{
						flexGrow: 1,
						width: "100%",
						bgcolor: "white",
						display: "flex",
						flexDirection: "column",
						gap: 1.5,
						py: 2,
					}}
				>
					{/* Author + date */}
					<Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
						<Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
							<Avatar src={avatarUrl} sx={{ width: 28, height: 28 }} />
							<Typography variant="caption" sx={{ fontWeight: 600 }}>
								{authorName}
							</Typography>
						</Stack>

						<Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
							{dateText}
						</Typography>
					</Stack>

					<Divider />

					{/* Title */}
					<Typography
						variant="h6"
						sx={{
							fontWeight: 900,
							textTransform: "uppercase",
							letterSpacing: 0.6,
							lineHeight: 1.2,
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
							minHeight: "2.4em",
							textAlign: "center",
						}}
					>
						{article?.title}
					</Typography>

					{/* Tags */}
					<Stack
						direction="row"
						spacing={1}
						useFlexGap
						flexWrap="wrap"
						justifyContent="center"
						sx={{ mt: "auto" }}
					>
						{tags.length ? (
							tags.slice(0, 5).map((t) => (
								<Chip key={t.id ?? t.name} label={t.name} size="small" variant="outlined" />
							))
						) : (
							<Chip label="no tags" size="small" variant="outlined" />
						)}
					</Stack>
				</CardContent>
			</Box>
		</Card>
	);
}
