import { Box, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function DesktopSearch({ tagQuery, setTagQuery, onSearch }) {
	return (
		<Box
			component="form"
			onSubmit={(e) => {
				e.preventDefault();
				onSearch();
			}}
			sx={{
				display: "flex",
				alignItems: "center",
				gap: 1,
				width: 360,
				maxWidth: "40vw",
			}}
		>
			<TextField
				size="small"
				value={tagQuery}
				onChange={(e) => setTagQuery(e.target.value)}
				placeholder="Filter by tag (e.g. santorini)"
				fullWidth
				sx={{
					"& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.12)" },
					input: { color: "inherit" },
				}}
			/>
			<IconButton color="inherit" type="submit" aria-label="search">
				<SearchIcon />
			</IconButton>
		</Box>
	);
}
