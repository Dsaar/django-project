import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, CircularProgress, Container, Typography } from "@mui/material";

import { fetchArticleById, updateArticle } from "../services/articles";
import { useAuth } from "../contexts/AuthContext";
import { canEditArticle } from "../utils/permissions";
import ArticleForm from "../components/ArticleForm";
import { useSnack } from "../contexts/SnackbarContext";

export default function EditArticlePage() {
	const { id } = useParams();
	const articleId = Number(id);
	const navigate = useNavigate();
	const { user } = useAuth();
	const snack = useSnack();

	const [article, setArticle] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		(async () => {
			setError("");
			setLoading(true);
			try {
				const a = await fetchArticleById(articleId);
				setArticle(a);
			} catch {
				setError("Failed to load article.");
			} finally {
				setLoading(false);
			}
		})();
	}, [articleId]);

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity="error">{error}</Alert>;
	if (!article) return null;

	if (!canEditArticle(user, article)) {
		return <Alert severity="warning">You don’t have permission to edit this article.</Alert>;
	}

	const handleSubmit = async (payload) => {
		try {
			await updateArticle(articleId, payload);
			snack.showSuccess("Article updated ✅");
			navigate(`/articles/${articleId}`);
		} catch {
			snack.showError("Failed to update article.");
		}
	};

	return (
		<Container maxWidth="md" sx={{ py: 4 }}>
			<Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
				Edit Article
			</Typography>
			<ArticleForm initialValues={article} onSubmit={handleSubmit} submitLabel="Update" />
		</Container>
	);
}
