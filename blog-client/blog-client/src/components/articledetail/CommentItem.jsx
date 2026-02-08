import { Paper, Typography, Stack, Button, TextField } from "@mui/material";

export default function CommentItem({
	comment,
	isEditing,
	editingValue,
	onChangeEditingValue,
	onStartEdit,
	onCancelEdit,
	onSaveEdit,
	onDelete,
	canManage,
}) {
	return (
		<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
			{!isEditing ? (
				<>
					<Typography sx={{ mb: 0.5, whiteSpace: "pre-line" }}>
						{comment.content}
					</Typography>

					<Typography variant="caption" color="text.secondary">
						by {comment.author_name}
					</Typography>

					{canManage && (
						<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
							<Button size="small" onClick={() => onStartEdit(comment)}>
								Edit
							</Button>
							<Button size="small" color="error" onClick={() => onDelete(comment.id)}>
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
						onChange={(e) => onChangeEditingValue(e.target.value)}
						label="Edit comment"
					/>
					<Stack direction="row" spacing={1} sx={{ mt: 1 }}>
						<Button variant="contained" size="small" onClick={onSaveEdit}>
							Save
						</Button>
						<Button size="small" onClick={onCancelEdit}>
							Cancel
						</Button>
					</Stack>
				</>
			)}
		</Paper>
	);
}
