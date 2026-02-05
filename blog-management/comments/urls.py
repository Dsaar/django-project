from django.urls import path
from .views import ArticleCommentListCreateView, CommentDetailView

urlpatterns = [
    path(
        "articles/<int:article_id>/comments/",
        ArticleCommentListCreateView.as_view(),
        name="article-comments",
    ),
    path(
        "comments/<int:pk>/",
        CommentDetailView.as_view(),
        name="comment-detail",
    ),
]

