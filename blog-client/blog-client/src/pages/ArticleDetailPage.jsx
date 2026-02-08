import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Alert, CircularProgress } from "@mui/material";

import { fetchArticleById } from "../services/articles";
import { fetchComments, createComment, deleteComment, updateComment } from "../services/comments";
import { useAuth } from "../contexts/AuthContext";
import { canManageComment } from "../utils/permissions";

import ArticleHero from "../components/articledetail/ArticleHero";
import ArticleBody from "../components/articledetail/ArticleBody";
import CommentComposer from "../components/articledetail/CommentComposer";
import CommentsSection from "../components/articledetail/CommentsSection";

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
	const dt = c?.created_at || c?.createdAt || c?.updated_at || c?.updatedAt || null;
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
			const [a, c] = await Promise.all([fetchArticleById(articleId), fetchComments(articleId)]);
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

	const sortedComments = useMemo(() => {
		const arr = Array.isArray(comments) ? [...comments] : [];
		arr.sort((a, b) => getCommentSortValue(b) - getCommentSortValue(a)); // latest first
		return arr;
	}, [comments]);

	const visibleComments = useMemo(() => {
		return showAllComments ? sortedComments : sortedComments.slice(0, 3);
	}, [sortedComments, showAllComments]);

	const submitComment = async () => {
		if (!content.trim()) return;
		await createComment(articleId, content.trim());
		setContent("");
		setShowAllComments(true);
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

	const dateText = formatDateTime(article?.published_at);
	const hasMoreThan3 = sortedComments.length > 3;

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<ArticleHero article={article} dateText={dateText} />

			<ArticleBody content={article?.content} />

			<CommentComposer
				isAuthenticated={!!user?.isAuthenticated}
				value={content}
				onChange={setContent}
				onSubmit={submitComment}
			/>

			<CommentsSection
				totalCount={sortedComments.length}
				comments={visibleComments}
				hasMoreThan3={hasMoreThan3}
				showAll={showAllComments}
				onToggleShowAll={() => setShowAllComments((v) => !v)}
				editingId={editingId}
				editingValue={editingValue}
				onChangeEditingValue={setEditingValue}
				onStartEdit={startEdit}
				onCancelEdit={cancelEdit}
				onSaveEdit={saveEdit}
				onDelete={handleDelete}
				canManageCommentFn={canManageComment}
				user={user}
			/>
		</Container>
	);
}
