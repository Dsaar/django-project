import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../utils/storage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
	baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
	const token = getAccessToken();
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const original = error.config;

		// if no response (server down / CORS / network), just throw
		if (!error.response) return Promise.reject(error);

		if (error.response.status === 401 && !original._retry) {
			original._retry = true;
			try {
				const refresh = getRefreshToken();
				if (!refresh) throw new Error("No refresh token");

				// IMPORTANT: use api.post with relative URL so we don't mess up BASE_URL
				const r = await api.post("/token/refresh/", { refresh });

				setTokens(r.data.access, refresh);
				original.headers.Authorization = `Bearer ${r.data.access}`;

				return api(original);
			} catch (e) {
				clearTokens();
			}
		}

		return Promise.reject(error);
	}
);

export default api;
