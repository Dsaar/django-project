import { createContext, useContext, useMemo, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
	const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

	const open = (message, severity = "info") => setSnack({ open: true, message, severity });
	const close = () => setSnack((s) => ({ ...s, open: false }));

	const value = useMemo(
		() => ({
			showSuccess: (m) => open(m, "success"),
			showError: (m) => open(m, "error"),
			showInfo: (m) => open(m, "info"),
			showWarning: (m) => open(m, "warning"),
		}),
		[]
	);

	return (
		<SnackbarContext.Provider value={value}>
			{children}
			<Snackbar open={snack.open} autoHideDuration={3000} onClose={close} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
				<Alert onClose={close} severity={snack.severity} variant="filled" sx={{ width: "100%" }}>
					{snack.message}
				</Alert>
			</Snackbar>
		</SnackbarContext.Provider>
	);
}

export const useSnack = () => useContext(SnackbarContext);
