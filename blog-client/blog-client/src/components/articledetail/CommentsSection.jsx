import { Typography, Paper, Stack, Box, Button } from "@mui/material";
import CommentItem from "./CommentItem";

export default function CommentsSection({
	totalCount,
	comments,
	hasMoreThan3,
	showAll,
	onToggleShowAll,

	editingId,
	editingValue,
	onChangeEditingValue,

	onStartEdit,
	onCancelEdit,
	onSaveEdit,
	onDelete,

	canManageCommentFn,
	user,
}) {
	return (
		<>
			<Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
				Comments ({totalCount})
			</Typography>

			{totalCount === 0 ? (
				<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
					<Typography color="text.secondary">No comments yet.</Typography>
				</Paper>
			) : (
				<Stack spacing={2} sx={{ mb: 2 }}>
					{comments.map((c) => (
						<CommentItem
							key={c.id}
							comment={c}
							isEditing={editingId === c.id}
							editingValue={editingId === c.id ? editingValue : ""}
							onChangeEditingValue={onChangeEditingValue}
							onStartEdit={onStartEdit}
							onCancelEdit={onCancelEdit}
							onSaveEdit={onSaveEdit}
							onDelete={onDelete}
							canManage={canManageCommentFn(user, c)}
						/>
					))}
				</Stack>
			)}

			{hasMoreThan3 && (
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<Button variant="outlined" onClick={onToggleShowAll}>
						{showAll ? "Show less" : "View more"}
					</Button>
				</Box>
			)}
		</>
	);
}
