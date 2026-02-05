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
	const [comments, setComments] = useState([]);
	const [content, setContent] = useState("");

	const [editingId, setEditingId] = useState(null);
	const [editingValue, setEditingValue] = useState("");

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
		if (!content.trim()) return;
		await createComment(articleId, content.trim());
		setContent("");
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

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity="error">{error}</Alert>;
	if (!article) return null;

	return (
		<>
			<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
				{article.title}
			</Typography>

			<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
				By {article.author_name} •{" "}
				{article.published_at ? new Date(article.published_at).toLocaleString() : ""}
			</Typography>

			<Typography sx={{ mb: 3 }}>{article.content}</Typography>

			<Typography variant="h6" sx={{ mb: 1 }}>
				Comments
			</Typography>

			<Stack spacing={2} sx={{ mb: 3 }}>
				{comments.map((c) => {
					const isEditing = editingId === c.id;

					return (
						<Paper key={c.id} variant="outlined" sx={{ p: 2 }}>
							{!isEditing ? (
								<>
									<Typography sx={{ mb: 0.5 }}>{c.content}</Typography>
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

			{user?.isAuthenticated && (
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
			)}
		</>
	);
}
