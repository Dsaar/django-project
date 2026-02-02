import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	Typography,
	Alert,
	Link,
	Stack,
} from "@mui/material";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [form, setForm] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const onChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setError("");

		const username = form.username.trim();
		if (!username) return setError("Username is required.");
		if (form.password.length < 6) return setError("Password must be at least 6 characters.");
		if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

		setLoading(true);

		try {
			// register
			await api.post("/register/", {
				username,
				password: form.password,
			});

			// auto-login
			await login(username, form.password);

			navigate("/");
		} catch (err) {
			const data = err?.response?.data;

			// Handle common DRF validation formats
			const msg =
				(typeof data === "string" && data) ||
				data?.detail ||
				(data?.username && data.username[0]) ||
				(data?.password && data.password[0]) ||
				"Registration failed. Please try again.";

			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ display: "grid", placeItems: "center", minHeight: "70vh" }}>
			<Card sx={{ width: "100%", maxWidth: 460 }}>
				<CardContent sx={{ p: 4 }}>
					<Typography variant="h5" gutterBottom>
						Register
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
						Create an account to post comments.
					</Typography>

					{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

					<Box component="form" onSubmit={onSubmit}>
						<Stack spacing={2}>
							<TextField
								label="Username"
								name="username"
								value={form.username}
								onChange={onChange}
								autoComplete="username"
								required
								fullWidth
							/>

							<TextField
								label="Password"
								name="password"
								type="password"
								value={form.password}
								onChange={onChange}
								autoComplete="new-password"
								required
								fullWidth
							/>

							<TextField
								label="Confirm Password"
								name="confirmPassword"
								type="password"
								value={form.confirmPassword}
								onChange={onChange}
								autoComplete="new-password"
								required
								fullWidth
							/>

							<Button
								type="submit"
								variant="contained"
								disabled={loading}
								fullWidth
							>
								{loading ? "Creating account..." : "Register"}
							</Button>

							<Typography variant="body2" color="text.secondary">
								Already have an account?{" "}
								<Link component={RouterLink} to="/login">
									Login
								</Link>
							</Typography>
						</Stack>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
