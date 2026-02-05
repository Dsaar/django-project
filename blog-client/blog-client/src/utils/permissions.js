export function isAdminLike(user) {
	const groups = user?.groups || [];
	return (
		user?.is_superuser === true ||
		user?.is_staff === true ||
		groups.includes("admin") ||
		groups.includes("writer")
	);
}

export function canManageComment(user, comment) {
	if (!user?.isAuthenticated) return false;

	const allowed = isAdminLike(user) || (user.username && comment?.author_name && user.username === comment.author_name);

	return allowed;
}
