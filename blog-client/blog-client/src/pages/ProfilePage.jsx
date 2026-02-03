import { useEffect, useState } from "react";
import {
	Typography,
	TextField,
	Button,
	Stack,
	Avatar,
	Paper,
	Alert,
} from "@mui/material";
import { fetchMe, updateMe } from "../services/profile";

export default function ProfilePage() {
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		profile: {
			display_name: "",
			bio: "",
			avatar_url: "",
		},
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		(async () => {
			try {
				const data = await fetchMe();
				setForm({
					first_name: data.first_name || "",
					last_name: data.last_name || "",
					profile: {
						display_name: data.profile?.display_name || "",
						bio: data.profile?.bio || "",
						avatar_url: data.profile?.avatar_url || "",
					},
				});
			} catch {
				setError("Failed to load profile.");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleProfileChange = (field, value) => {
		setForm((prev) => ({
			...prev,
			profile: { ...prev.profile, [field]: value },
		}));
	};

	const handleSubmit = async () => {
		setError("");
		setSuccess("");
		try {
			await updateMe(form);
			setSuccess("Profile updated successfully.");
		} catch {
			setError("Failed to update profile.");
		}
	};

	if (loading) return null;

	return (
		<Paper sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
			<Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
				Your profile
			</Typography>

			{error && <Alert severity="error">{error}</Alert>}
			{success && <Alert severity="success">{success}</Alert>}

			<Stack spacing={2}>
				<Stack direction="row" spacing={2} alignItems="center">
					<Avatar
						src={form.profile.avatar_url}
						sx={{ width: 64, height: 64 }}
					/>
					<TextField
						fullWidth
						label="Avatar URL"
						value={form.profile.avatar_url}
						onChange={(e) =>
							handleProfileChange("avatar_url", e.target.value)
						}
					/>
				</Stack>

				<Stack direction="row" spacing={2}>
					<TextField
						fullWidth
						label="First name"
						value={form.first_name}
						onChange={(e) => handleChange("first_name", e.target.value)}
					/>
					<TextField
						fullWidth
						label="Last name"
						value={form.last_name}
						onChange={(e) => handleChange("last_name", e.target.value)}
					/>
				</Stack>

				<TextField
					fullWidth
					label="Display name"
					value={form.profile.display_name}
					onChange={(e) =>
						handleProfileChange("display_name", e.target.value)
					}
				/>

				<TextField
					fullWidth
					multiline
					minRows={3}
					label="Bio"
					value={form.profile.bio}
					onChange={(e) => handleProfileChange("bio", e.target.value)}
				/>

				<Button variant="contained" onClick={handleSubmit}>
					Save changes
				</Button>
			</Stack>
		</Paper>
	);
}
