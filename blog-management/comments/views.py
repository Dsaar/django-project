from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404

from posts.models import Article
from .models import Comment
from .serializers import CommentSerializer
from .permissions import IsAdminOrOwner


class ArticleCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        article_id = self.kwargs["article_id"]
        return Comment.objects.filter(article_id=article_id)

    def perform_create(self, serializer):
        article = get_object_or_404(Article, id=self.kwargs["article_id"])
        serializer.save(author=self.request.user, article=article)

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAdminOrOwner]

