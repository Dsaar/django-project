import api from "./api";

// GET comments for an article
export async function fetchComments(articleId) {
	const { data } = await api.get(`/articles/${articleId}/comments/`);

	// paginated: { results: [...] }
	if (data && Array.isArray(data.results)) return data.results;

	// non-paginated: [...]
	if (Array.isArray(data)) return data;

	return [];
}

// POST comment to an article
export async function createComment(articleId, content) {
	const { data } = await api.post(`/articles/${articleId}/comments/`, { content });
	return data;
}

// PUT/PATCH a comment by id (common pattern)
export async function updateComment(commentId, content) {
	const { data } = await api.patch(`/comments/${commentId}/`, { content });
	return data;
}

// DELETE a comment by id
export async function deleteComment(commentId) {
	await api.delete(`/comments/${commentId}/`);
}

