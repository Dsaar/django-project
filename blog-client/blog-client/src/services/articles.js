import api from "./api";

export async function fetchArticles(params = {}) {
	const { data } = await api.get("/articles/", { params });

	// DRF pagination: { results: [...] }
	if (data && Array.isArray(data.results)) return data.results;

	// Non-paginated: [...]
	if (Array.isArray(data)) return data;

	// Fallback
	return [];
}

export async function fetchLatestArticles() {
	const { data } = await api.get("/articles/latest/");

	if (Array.isArray(data)) return data;
	if (data && Array.isArray(data.results)) return data.results;

	return [];
}

export async function fetchArticleById(id) {
	const { data } = await api.get(`/articles/${id}/`);
	return data;
}
