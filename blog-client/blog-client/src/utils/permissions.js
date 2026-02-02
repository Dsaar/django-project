export function isAdminLike(user) {
	const groups = user?.groups || [];
	return groups.includes("admin") || groups.includes("writer");
}

export function canManageComment(user, comment) {
	if (!user?.isAuthenticated) return false;
	if (isAdminLike(user)) return true;
	return user.username && comment?.author_name && user.username === comment.author_name;
}
