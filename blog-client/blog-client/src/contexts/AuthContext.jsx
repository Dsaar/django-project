import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { fetchMe } from "../services/profile";
import { setTokens, clearTokens, getAccessToken, getRefreshToken } from "../utils/storage";

const AuthContext = createContext(null);

const emptyUser = {
	id: null,
	username: null,
	email: null,
	first_name: "",
	last_name: "",
	profile: { display_name: "", bio: "", avatar_url: "" },
	isAuthenticated: false,
};

export function AuthProvider({ children }) {
	const [user, setUser] = useState(emptyUser);
	const [isReady, setIsReady] = useState(false); // <-- critical for refresh behavior

	async function loadMe() {
		const me = await fetchMe();
		setUser({ ...me, isAuthenticated: true });
	}

	useEffect(() => {
		// On page refresh:
		// 1) if we have an access token -> try /me
		// 2) if access expired but refresh exists -> interceptor should refresh on 401, then /me works
		// 3) if no tokens -> logged out
		(async () => {
			try {
				const access = getAccessToken();
				const refresh = getRefreshToken();

				if (!access && !refresh) {
					setUser(emptyUser);
					return;
				}

				// This will succeed if access is valid, or trigger refresh via interceptor if access is expired
				await loadMe();
			} catch (e) {
				clearTokens();
				setUser(emptyUser);
			} finally {
				setIsReady(true);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const login = async (username, password) => {
		const { data } = await api.post("/token/", { username, password });
		setTokens(data.access, data.refresh);
		await loadMe(); // <-- now username & avatar come from backend
		setIsReady(true);
	};

	const logout = () => {
		clearTokens();
		setUser(emptyUser);
		setIsReady(true);
	};

	const value = useMemo(
		() => ({ user, setUser, login, logout, isReady }),
		[user, isReady]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
