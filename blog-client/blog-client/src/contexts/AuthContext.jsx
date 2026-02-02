import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { setTokens, clearTokens, getAccessToken, getRefreshToken } from "../utils/storage";

const AuthContext = createContext(null);

function decodeUser(accessToken) {
	try {
		const payload = jwtDecode(accessToken);
		return {
			username: payload.username || payload.user || payload.user_name || null,
			userId: payload.user_id || payload.id || payload.sub || null,
			groups: payload.groups || [], // only if you included in token; otherwise []
			isAuthenticated: true,
		};
	} catch {
		return { username: null, userId: null, groups: [], isAuthenticated: false };
	}
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState({ username: null, userId: null, groups: [], isAuthenticated: false });

	useEffect(() => {
		const access = getAccessToken();
		if (access) setUser(decodeUser(access));
	}, []);

	const login = async (username, password) => {
		const { data } = await api.post("/token/", { username, password });
		setTokens(data.access, data.refresh);
		setUser(decodeUser(data.access));
	};

	const logout = () => {
		clearTokens();
		setUser({ username: null, userId: null, groups: [], isAuthenticated: false });
	};

	const value = useMemo(() => ({ user, login, logout }), [user]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
