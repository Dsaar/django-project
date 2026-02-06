// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import {
	Typography,
	Stack,
	Button,
	Alert,
	Paper,
	Box,
	Container,
	Snackbar,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Link as RouterLink } from "react-router-dom";

import { fetchLatestArticles, deleteArticle } from "../services/articles";
import ArticleCard from "../components/ArticleCard";
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
	const { user } = useAuth();

	const [items, setItems] = useState([]);
	const [error, setError] = useState("");

	const [snack, setSnack] = useState({
		open: false,
		msg: "",
		severity: "success",
	});

	// ✅ confirm modal state (same pattern as ArticlesPage)
	const [confirm, setConfirm] = useState({ open: false, article: null, busy: false });

	useEffect(() => {
		fetchLatestArticles()
			.then((data) => setItems(Array.isArray(data) ? data : []))
			.catch(() => setError("Failed to load latest articles."));
	}, []);

	// called by ArticleCard trash icon
	const requestDelete = (article) => {
		setConfirm({ open: true, article, busy: false });
	};

	const closeConfirm = () => {
		if (confirm.busy) return;
		setConfirm({ open: false, article: null, busy: false });
	};

	const doDelete = async () => {
		const id = confirm.article?.id;
		if (!id) return;

		setConfirm((c) => ({ ...c, busy: true }));
		try {
			await deleteArticle(id);

			// ✅ remove immediately from HomePage list
			setItems((prev) => prev.filter((a) => a.id !== id));

			setSnack({ open: true, msg: "Article deleted.", severity: "success" });
			setConfirm({ open: false, article: null, busy: false });
		} catch (e) {
			setSnack({ open: true, msg: "Failed to delete article.", severity: "error" });
			setConfirm((c) => ({ ...c, busy: false }));
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			{/* HERO */}
			<Paper
				variant="outlined"
				sx={{
					p: { xs: 3, md: 5 },
					mb: 4,
					borderRadius: 4,
					background:
						"linear-gradient(135deg, rgba(31,111,120,0.12), rgba(224,122,95,0.12))",
				}}
			>
				<Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
					Wander Notes
				</Typography>

				<Typography color="text.secondary" sx={{ maxWidth: 720 }}>
					Stories, guides, and photo-driven travel diaries — built with Django + React.
				</Typography>

				<Box sx={{ mt: 2 }}>
					<Button component={RouterLink} to="/articles" variant="contained">
						Explore all posts
					</Button>
				</Box>
			</Paper>

			{/* LATEST */}
			<Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
				Latest stories
			</Typography>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Stack spacing={3}>
				{items.map((a) => (
					<ArticleCard
						key={a.id}
						article={a}
						// ✅ IMPORTANT: ArticleCard expects onRequestDelete (not onDelete)
						onRequestDelete={user?.isAuthenticated ? requestDelete : undefined}
					/>
				))}
			</Stack>

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
