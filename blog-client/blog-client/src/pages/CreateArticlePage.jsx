// src/pages/CreateArticlePage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Alert,
	Box,
	Button,
	Container,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { createArticle } from "../services/articles";

export default function CreateArticlePage() {
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [tags, setTags] = useState(""); // comma-separated
	const [content, setContent] = useState("");

	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	const onSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!title.trim() || !content.trim()) {
			setError("Title and content are required.");
			return;
		}

		const tags_input = tags
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);

		try {
			setSaving(true);
			const created = await createArticle({
				title: title.trim(),
				content: content.trim(),
				image_url: imageUrl.trim() || null,
				tags_input,
			});

			navigate(`/articles/${created.id}`);
		} catch (err) {
			setError("Failed to create article. (Are you allowed to post?)");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Container maxWidth="md" sx={{ py: 4 }}>
			<Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
				New Article
			</Typography>

			<Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Box component="form" onSubmit={onSubmit}>
					<Stack spacing={2}>
						<TextField
							label="Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							fullWidth
							required
						/>

						<TextField
							label="Image URL (optional)"
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							fullWidth
						/>

						<TextField
							label="Tags (comma separated)"
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							fullWidth
							placeholder="santorini, greece, beach"
						/>

						<TextField
							label="Content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							fullWidth
							required
							multiline
							minRows={8}
						/>

						<Stack direction="row" spacing={1} justifyContent="flex-end">
							<Button variant="outlined" onClick={() => navigate(-1)}>
								Cancel
							</Button>
							<Button type="submit" variant="contained" disabled={saving}>
								{saving ? "Saving..." : "Publish"}
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Paper>
		</Container>
	);
}
