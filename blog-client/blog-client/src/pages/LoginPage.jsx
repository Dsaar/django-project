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
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [form, setForm] = useState({ username: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const onChange = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await login(form.username.trim(), form.password);
			navigate("/");
		} catch (err) {
			const msg =
				err?.response?.data?.detail ||
				"Login failed. Please check your credentials.";
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
						Login
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
						Sign in to comment and manage your content.
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
								autoComplete="current-password"
								required
								fullWidth
							/>

							<Button
								type="submit"
								variant="contained"
								disabled={loading}
								fullWidth
							>
								{loading ? "Signing in..." : "Login"}
							</Button>

							<Typography variant="body2" color="text.secondary">
								Don&apos;t have an account?{" "}
								<Link component={RouterLink} to="/register">
									Register
								</Link>
							</Typography>
						</Stack>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
}
