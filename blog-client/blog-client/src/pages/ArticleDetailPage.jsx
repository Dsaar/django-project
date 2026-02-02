// src/pages/ArticleDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Typography,
	Button,
	TextField,
	Stack,
	Alert,
	CircularProgress,
	Paper,
	Divider,
} from "@mui/material";

import { fetchArticleById } from "../services/articles";
import { fetchComments, createComment, deleteComment, updateComment } from "../services/comments";
import { useAuth } from "../contexts/AuthContext";
import { canManageComment } from "../utils/permissions";

export default function ArticleDetailPage() {
	const { id } = useParams();
	const articleId = Number(id);

	const { user } = useAuth();

	const [article, setArticle] = useState(null);
	const [comments, setComments] = useState([]); // ALWAYS an array
	const [content, setContent] = useState("");

	const [editingId, setEditingId] = useState(null);
	const [editingText, setEditingText] = useState("");

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
		} catch (e) {
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

	const submitComment = async () => {
		const text = content.trim();
		if (!text) return;
		await createComment(articleId, text);
		setContent("");
		await load();
	};

	const startEdit = (c) => {
		setEditingId(c.id);
		setEditingText(c.content || "");
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditingText("");
	};

	const saveEdit = async () => {
		const text = editingText.trim();
		if (!text) return;
		await updateComment(editingId, text);
		cancelEdit();
		await load();
	};

	const handleDelete = async (commentId) => {
		await deleteComment(commentId);
		await load();
	};

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity="error">{error}</Alert>;
	if (!article) return null;

	const published = article.published_at ? new Date(article.published_at).toLocaleString() : "";

	return (
		<>
			<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
				{article.title}
			</Typography>

			<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
				By {article.author_name || "Unknown"}{published ? ` • ${published}` : ""}
			</Typography>

			<Typography sx={{ mb: 3 }}>{article.content}</Typography>

			<Divider sx={{ mb: 2 }} />

			<Typography variant="h6" sx={{ mb: 1 }}>
				Comments
			</Typography>

			<Stack spacing={2} sx={{ mb: 3 }}>
				{comments.length === 0 && (
					<Typography variant="body2" color="text.secondary">
						No comments yet.
					</Typography>
				)}

				{comments.map((c) => {
					const canManage = canManageComment(user, c);

					return (
						<Paper key={c.id} variant="outlined" sx={{ p: 2 }}>
							{editingId === c.id ? (
								<>
									<TextField
										fullWidth
										multiline
										minRows={2}
										value={editingText}
										onChange={(e) => setEditingText(e.target.value)}
										label="Edit comment"
									/>
									<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
										<Button size="small" variant="contained" onClick={saveEdit}>
											Save
										</Button>
										<Button size="small" variant="outlined" onClick={cancelEdit}>
											Cancel
										</Button>
									</Stack>
								</>
							) : (
								<>
									<Typography sx={{ mb: 0.5 }}>{c.content}</Typography>
									<Typography variant="caption" color="text.secondary">
										by {c.author_name}
									</Typography>

									{canManage && (
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
							)}
						</Paper>
					);
				})}
			</Stack>

			{user?.isAuthenticated ? (
				<>
					<TextField
						fullWidth
						multiline
						minRows={3}
						value={content}
						onChange={(e) => setContent(e.target.value)}
						label="Add comment"
					/>
					<Button onClick={submitComment} sx={{ mt: 1 }} variant="contained">
						Submit
					</Button>
				</>
			) : (
				<Alert severity="info">Log in to add a comment.</Alert>
			)}
		</>
	);
}
