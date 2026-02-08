from rest_framework import viewsets, permissions, decorators, response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Article
from .serializers import ArticleSerializer
from common.permissions import IsOwnerOrAdminGroup


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.select_related("author").prefetch_related("tags")
    serializer_class = ArticleSerializer

    # If you want ALL articles returned (no pagination)
    pagination_class = None

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = {
    "tags__name": ["iexact", "icontains"],
}

    search_fields = [
        "title",
        "content",
        "author__username",
        "author__first_name",
        "author__last_name",
    ]

    @decorators.action(
        detail=False,
        methods=["get"],
        url_path="latest",
        permission_classes=[permissions.AllowAny],
    )
    def latest(self, request):
        latest_three = self.get_queryset().order_by("-published_at")[:3]
        data = self.get_serializer(latest_three, many=True).data
        return response.Response(data)

    def get_permissions(self):
        # Anyone can read
        if self.action in ["list", "retrieve", "latest"]:
            return [permissions.AllowAny()]

        # Any logged-in user can create
        if self.action == "create":
            return [permissions.IsAuthenticated()]

        # Update/Delete: owner OR admin group (and must be logged in)
        if self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsOwnerOrAdminGroup()]

        return [permissions.IsAuthenticatedOrReadOnly()]
