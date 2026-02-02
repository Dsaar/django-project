import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ArticlesPage from "../pages/ArticlesPage";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

export default function Router() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/articles" element={<ArticlesPage />} />
			<Route path="/articles/:id" element={<ArticleDetailPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
		</Routes>
	);
}
