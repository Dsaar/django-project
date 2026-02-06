// src/pages/ArticleDetailPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Container,
	Typography,
	Button,
	TextField,
	Stack,
	Alert,
	CircularProgress,
	Paper,
	Box,
	Divider,
	Avatar,
	Chip,
} from "@mui/material";

import { fetchArticleById } from "../services/articles";
import {
	fetchComments,
	createComment,
	deleteComment,
	updateComment,
} from "../services/comments";
import { useAuth } from "../contexts/AuthContext";
import { canManageComment } from "../utils/permissions";

const FALLBACK_IMG =
	"https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=60";
const FALLBACK_AVATAR = "https://i.pravatar.cc/100";

function formatDateTime(iso) {
	if (!iso) return "";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function getCommentSortValue(c) {
	// Prefer a timestamp field if you have it; fallback to id
	const dt =
		c?.created_at || c?.createdAt || c?.updated_at || c?.updatedAt || null;
	const t = dt ? new Date(dt).getTime() : NaN;
	if (!Number.isNaN(t)) return t;
	return Number(c?.id) || 0;
}

export default function ArticleDetailPage() {
	const { id } = useParams();
	const articleId = Number(id);

	const { user } = useAuth();

	const [article, setArticle] = useState(null);
	const [comments, setComments] = useState([]);
	const [content, setContent] = useState("");

	const [editingId, setEditingId] = useState(null);
	const [editingValue, setEditingValue] = useState("");

	const [showAllComments, setShowAllComments] = useState(false);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const load = async () => {
		setError("");
		setLoading(true);
		try {
			const [a, c] = await Promise.all([
				fetchArticleById(articleId),
				fetchComments(articleId),
			]);
			setArticle(a);
			setComments(Array.isArray(c) ? c : []);
		} catch {
			setError("Failed to load article or comments.");
			setArticle(null);
			setComments([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!Number.isFinite(articleId)) return;
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [articleId]);

	// ✅ Always runs (no conditional hook) => fixes hook-order crash
	const sortedComments = useMemo(() => {
		const arr = Array.isArray(comments) ? [...comments] : [];
		// Latest first
		arr.sort((a, b) => getCommentSortValue(b) - getCommentSortValue(a));
		return arr;
	}, [comments]);

	const visibleComments = useMemo(() => {
		if (showAllComments) return sortedComments;
		return sortedComments.slice(0, 3);
	}, [sortedComments, showAllComments]);

	const submitComment = async () => {
		if (!content.trim()) return;
		await createComment(articleId, content.trim());
		setContent("");
		setShowAllComments(true); // optional UX: show all after posting
		await load();
	};

	const startEdit = (comment) => {
		setEditingId(comment.id);
		setEditingValue(comment.content || "");
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditingValue("");
	};

	const saveEdit = async () => {
		if (!editingValue.trim()) return;
		await updateComment(editingId, editingValue.trim());
		cancelEdit();
		await load();
	};

	const handleDelete = async (commentId) => {
		await deleteComment(commentId);
		await load();
	};

	// ✅ returns AFTER all hooks (safe)
	if (loading) {
		return (
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<CircularProgress />
			</Container>
		);
	}

	if (error) {
		return (
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Alert severity="error">{error}</Alert>
			</Container>
		);
	}

	if (!article) return null;

	const heroImg = article?.image_url || FALLBACK_IMG;
	const authorName = article?.author_name || "Traveler";
	const authorAvatar = article?.author_avatar_url || FALLBACK_AVATAR;
	const dateText = formatDateTime(article?.published_at);
	const tags = Array.isArray(article?.tags) ? article.tags : [];

	const hasMoreThan3 = sortedComments.length > 3;

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* HERO */}
			<Paper variant="outlined" sx={{ overflow: "hidden", borderRadius: 3, mb: 3 }}>
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

				<Box sx={{ p: { xs: 2.5, md: 3 } }}>
					<Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
						{article.title}
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
								<Chip
									key={t.id ?? t.name}
									label={t.name}
									size="small"
									variant="outlined"
								/>
							))}
						</Stack>
					)}
				</Box>
			</Paper>

			{/* CONTENT */}
			<Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, mb: 3 }}>
				<Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
					{article.content}
				</Typography>
			</Paper>

			{/* ✅ ADD COMMENT ABOVE LIST */}
			{user?.isAuthenticated ? (
				<Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
					<Typography sx={{ fontWeight: 900, mb: 1 }}>Add a comment</Typography>
					<TextField
						fullWidth
						multiline
						minRows={3}
						value={content}
						onChange={(e) => setContent(e.target.value)}
						label="Your comment"
					/>
					<Button onClick={submitComment} sx={{ mt: 1 }} variant="contained">
						Submit
					</Button>
				</Paper>
			) : (
				<Alert severity="info" sx={{ mb: 2 }}>
					Log in to add a comment.
				</Alert>
			)}

			{/* COMMENTS LIST */}
			<Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
				Comments ({sortedComments.length})
			</Typography>

			{sortedComments.length === 0 ? (
				<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
					<Typography color="text.secondary">No comments yet.</Typography>
				</Paper>
			) : (
				<Stack spacing={2} sx={{ mb: 2 }}>
					{visibleComments.map((c) => {
						const isEditing = editingId === c.id;

						return (
							<Paper key={c.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
								{!isEditing ? (
									<>
										<Typography sx={{ mb: 0.5, whiteSpace: "pre-line" }}>
											{c.content}
										</Typography>

										<Typography variant="caption" color="text.secondary">
											by {c.author_name}
										</Typography>

										{canManageComment(user, c) && (
											<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
												<Button size="small" onClick={() => startEdit(c)}>
													Edit
												</Button>
												<Button size="small" color="error" onClick={() => handleDelete(c.id)}>
													Delete
												</Button>
											</Stack>
										)}
									</>
								) : (
									<>
										<TextField
											fullWidth
											multiline
											minRows={2}
											value={editingValue}
											onChange={(e) => setEditingValue(e.target.value)}
											label="Edit comment"
										/>
										<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
											<Button variant="contained" size="small" onClick={saveEdit}>
												Save
											</Button>
											<Button size="small" onClick={cancelEdit}>
												Cancel
											</Button>
										</Stack>
									</>
								)}
							</Paper>
						);
					})}
				</Stack>
			)}

			{/* ✅ VIEW MORE / SHOW LESS */}
			{hasMoreThan3 && (
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Button
						variant="outlined"
						onClick={() => setShowAllComments((v) => !v)}
					>
						{showAllComments ? "Show less" : "View more"}
					</Button>
				</Box>
			)}
		</Container>
	);
}
