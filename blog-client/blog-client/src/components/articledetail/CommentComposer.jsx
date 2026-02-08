import { Paper, Typography, TextField, Button, Alert } from "@mui/material";

export default function CommentComposer({
	isAuthenticated,
	value,
	onChange,
	onSubmit,
}) {
	if (!isAuthenticated) {
		return (
			<Alert severity="info" sx={{ mb: 2 }}>
				Log in to add a comment.
			</Alert>
		);
	}

	return (
		<Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
			<Typography sx={{ fontWeight: 900, mb: 1 }}>Add a comment</Typography>
			<TextField
				fullWidth
				multiline
				minRows={3}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				label="Your comment"
			/>
			<Button onClick={onSubmit} sx={{ mt: 1 }} variant="contained">
				Submit
			</Button>
		</Paper>
	);
}
