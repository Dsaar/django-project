// src/pages/ArticlesPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchArticles, deleteArticle } from "../services/articles";
import ArticleCard from "../components/ArticleCard";
import {
	Container,
	Typography,
	Alert,
	Box,
	Stack,
	Chip,
	Button,
	Fab,
	Snackbar,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../contexts/AuthContext";

export default function ArticlesPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	const tag = useMemo(() => (searchParams.get("tag") || "").trim(), [searchParams]);

	const [articles, setArticles] = useState([]);
	const [error, setError] = useState("");

	const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

	// ✅ modal state
	const [confirm, setConfirm] = useState({ open: false, article: null, busy: false });

	useEffect(() => {
		(async () => {
			try {
				setError("");
				const params = tag ? { tags__name: tag } : {};
				const items = await fetchArticles(params);
				setArticles(Array.isArray(items) ? items : []);
			} catch {
				setError("Failed to load articles.");
				setArticles([]);
			}
		})();
	}, [tag]);

	const clearFilter = () => {
		const next = new URLSearchParams(searchParams);
		next.delete("tag");
		setSearchParams(next);
	};

	// called by ArticleCard trash icon
	const requestDelete = (article) => {
		setConfirm({ open: true, article, busy: false });
	};

	const closeConfirm = () => {
		if (confirm.busy) return;
		setConfirm({ open: false, article: null, busy: false });
	};

	const doDelete = async () => {
		if (!confirm.article?.id) return;

		setConfirm((c) => ({ ...c, busy: true }));
		try {
			const id = confirm.article.id;
			await deleteArticle(id);

			// ✅ instantly remove from UI
			setArticles((prev) => prev.filter((a) => a.id !== id));

			// ✅ show snackbar
			setSnack({ open: true, msg: "Article deleted.", severity: "success" });

			// close modal
			setConfirm({ open: false, article: null, busy: false });
		} catch {
			setSnack({ open: true, msg: "Failed to delete article.", severity: "error" });
			setConfirm((c) => ({ ...c, busy: false }));
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
				<Typography variant="h4" sx={{ flex: 1, fontWeight: 900 }}>
					{tag ? `Articles tagged: ${tag}` : "All Articles"}
				</Typography>

				{tag && (
					<>
						<Chip label={`#${tag}`} onDelete={clearFilter} />
						<Button variant="outlined" onClick={clearFilter}>
							Clear
						</Button>
					</>
				)}
			</Stack>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Box
				sx={{
					display: "grid",
					gap: 3,
					gridTemplateColumns: {
						xs: "1fr",
						sm: "repeat(2, minmax(0, 1fr))",
						md: "repeat(3, minmax(0, 1fr))",
					},
					alignItems: "stretch",
				}}
			>
				{articles.map((a) => (
					<Box key={a.id} sx={{ display: "flex" }}>
						<ArticleCard article={a} onRequestDelete={requestDelete} />
					</Box>
				))}
			</Box>

			{user?.isAuthenticated && (
				<Fab
					color="primary"
					aria-label="add article"
					onClick={() => navigate("/articles/new")}
					sx={{
						position: "fixed",
						right: { xs: 16, md: 28 },
						bottom: { xs: 16, md: 28 },
						boxShadow: 6,
					}}
				>
					<AddIcon />
				</Fab>
			)}

			{/* ✅ Confirm delete modal */}
			<Dialog open={confirm.open} onClose={closeConfirm} maxWidth="xs" fullWidth>
				<DialogTitle>Delete article?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This cannot be undone.
						{confirm.article?.title ? (
							<>
								<br />
								<strong>{confirm.article.title}</strong>
							</>
						) : null}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeConfirm} disabled={confirm.busy}>
						Cancel
					</Button>
					<Button onClick={doDelete} color="error" variant="contained" disabled={confirm.busy}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* ✅ Snackbar */}
			<Snackbar
				open={snack.open}
				autoHideDuration={2500}
				onClose={() => setSnack((s) => ({ ...s, open: false }))}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<MuiAlert
					elevation={6}
					variant="filled"
					severity={snack.severity}
					onClose={() => setSnack((s) => ({ ...s, open: false }))}
				>
					{snack.msg}
				</MuiAlert>
			</Snackbar>
		</Container>
	);
}
