# blog_api/api_docs.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse


@api_view(["GET"])
@permission_classes([AllowAny])
def api_docs(request, format=None):
    return Response(
        {
            "auth": {
                "login_browsable": reverse("rest_framework:login", request=request, format=format),
                "logout_browsable": reverse("rest_framework:logout", request=request, format=format),
                "token_obtain_pair (POST)": reverse("token_obtain_pair", request=request, format=format),
                "token_refresh (POST)": reverse("token_refresh", request=request, format=format),
            },
            "accounts": {
                "register (POST)": reverse("register", request=request, format=format),
                "me": reverse("me", request=request, format=format),
            },
            "posts": {
                "articles": reverse("articles-list", request=request, format=format),
                "latest": reverse("articles-latest", request=request, format=format),
            },
            "comments": {
                # These require an article_id or pk, so we show URL patterns:
                "article_comments": "/api/articles/<article_id>/comments/",
                "comment_detail": "/api/comments/<pk>/",
            },
        }
    )
