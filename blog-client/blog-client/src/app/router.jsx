import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ArticlesPage from "../pages/ArticlesPage";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import CreateArticlePage from "../pages/CreateArticlePage";
import EditArticlePage from "../pages/EditArticlePage";

import ProtectedRoute from "../components/ProtectedRoute";

export default function Router() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/articles" element={<ArticlesPage />} />
			<Route path="/articles/:id" element={<ArticleDetailPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/articles/:id/edit" element={<EditArticlePage />} />

			
			


			<Route
				path="/profile"
				element={
					<ProtectedRoute>
						<ProfilePage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/articles/new"
				element={
					<ProtectedRoute>
						<CreateArticlePage />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}
