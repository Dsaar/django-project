import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		mode: "light",
		background: {
			default: "#faf7f2",
			paper: "#ffffff",
		},
		primary: {
			main: "#1f6f78",
		},
		secondary: {
			main: "#e07a5f",
		},
	},
	shape: { borderRadius: 14 },
	typography: {
		fontFamily: `"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial`,
		h4: { fontWeight: 800, letterSpacing: -0.5 },
		h5: { fontWeight: 800 },
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 18,
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 999,
					textTransform: "none",
					fontWeight: 700,
				},
			},
		},
	},
});

export default theme;
