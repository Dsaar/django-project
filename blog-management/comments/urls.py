from django.urls import path
from .views import ArticleCommentListCreateView, CommentDeleteView

urlpatterns = [
    path(
        "articles/<int:article_id>/comments/",
        ArticleCommentListCreateView.as_view(),
        name="article-comments",
    ),
    path(
        "comments/<int:pk>/",
        CommentDeleteView.as_view(),
        name="comment-delete",
    ),
]

