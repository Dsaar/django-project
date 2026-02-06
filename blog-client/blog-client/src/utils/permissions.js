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


export function canEditArticle(user, article) {
	if (!user?.isAuthenticated) return false;

	// Admin / writer
	if (user.is_staff || user.is_superuser) return true;

	// Author
	return user.username === article?.author_name;
}

export function canDeleteArticle(user, article) {
	// ✅ Same rules as edit
	return canEditArticle(user, article);
}
