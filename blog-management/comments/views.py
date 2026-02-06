from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404

from posts.models import Article
from .models import Comment
from .serializers import CommentSerializer
from common.permissions import IsOwnerOrAdminGroup  # ✅ reuse shared permission


class ArticleCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    pagination_class = None

    def get_queryset(self):
        article_id = self.kwargs["article_id"]
        return Comment.objects.filter(article_id=article_id).select_related("author")

    def perform_create(self, serializer):
        article = get_object_or_404(Article, id=self.kwargs["article_id"])
        serializer.save(author=self.request.user, article=article)

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/comments/<id>/      (optional but handy)
    PATCH  /api/comments/<id>/      (edit comment)
    PUT    /api/comments/<id>/
    DELETE /api/comments/<id>/      (delete comment)
    """
    queryset = Comment.objects.all().select_related("author", "article")
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdminGroup] 
