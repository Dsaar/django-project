from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404

from posts.models import Article
from .models import Comment
from .serializers import CommentSerializer
from common.permissions import IsOwnerOrAdminGroup  # ✅ reuse shared permission


class ArticleCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        article_id = self.kwargs["article_id"]
        return Comment.objects.filter(article_id=article_id)

    def perform_create(self, serializer):
        article = get_object_or_404(Article, id=self.kwargs["article_id"])
        serializer.save(author=self.request.user, article=article)

    def get_permissions(self):
        # keep it simple: anyone can read, only authenticated can create
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrAdminGroup]  # ✅ owner deletes own, admin deletes any
