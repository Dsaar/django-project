import { useState } from "react";
import { Stack, TextField, Button, Paper } from "@mui/material";

export default function ArticleForm({ initialValues, onSubmit, submitLabel = "Save" }) {
	const [title, setTitle] = useState(initialValues?.title || "");
	const [content, setContent] = useState(initialValues?.content || "");
	const [imageUrl, setImageUrl] = useState(initialValues?.image_url || "");
	const [tags, setTags] = useState((initialValues?.tags || []).map(t => t.name).join(", "));

	const handleSubmit = async (e) => {
		e.preventDefault();

		const tags_input = tags
			.split(",")
			.map(s => s.trim())
			.filter(Boolean);

		await onSubmit({
			title: title.trim(),
			content: content.trim(),
			image_url: imageUrl.trim(),
			tags_input,
		});
	};

	return (
		<Paper variant="outlined" sx={{ p: 3 }}>
			<Stack component="form" onSubmit={handleSubmit} spacing={2}>
				<TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
				<TextField label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
				<TextField label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
				<TextField label="Content" value={content} onChange={(e) => setContent(e.target.value)} required multiline minRows={6} />

				<Button type="submit" variant="contained">
					{submitLabel}
				</Button>
			</Stack>
		</Paper>
	);
}
