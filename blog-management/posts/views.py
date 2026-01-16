from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, decorators, response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Article
from .serializers import ArticleSerializer
from .permissions import IsAdminUserOnly


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.select_related("author").prefetch_related("tags")
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["tags__name"]
    search_fields = ["title", "content", "author__username", "author__first_name", "author__last_name"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUserOnly()]
        return [permissions.AllowAny()]

    @decorators.action(detail=False, methods=["get"], url_path="latest", permission_classes=[permissions.AllowAny])
    def latest(self, request):
        latest_three = self.get_queryset().order_by("-published_at")[:3]
        data = ArticleSerializer(latest_three, many=True).data
        return response.Response(data)
