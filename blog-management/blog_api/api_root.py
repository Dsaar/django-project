# blog_api/api_root.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(["GET"])
@permission_classes([AllowAny])
def api_root(request, format=None):
    """
    Human-friendly API index page for the DRF Browsable API.
    Shows all important endpoints (including ones not registered via a Router).
    """
    return Response(
        {
            "auth": {
                "token_obtain_pair": reverse("token_obtain_pair", request=request, format=format),
                "token_refresh": reverse("token_refresh", request=request, format=format),
                "browsable_login": reverse("rest_framework:login", request=request, format=format),
                "browsable_logout": reverse("rest_framework:logout", request=request, format=format),
            },
            "accounts": {
                "register": reverse("register", request=request, format=format),
                "me": reverse("me", request=request, format=format),
            },
            "posts": {
                "articles_list": reverse("articles-list", request=request, format=format),
                "articles_latest": reverse("articles-latest", request=request, format=format),
                # Example detail URL (replace 1 with a real article id)
                "article_detail_example": reverse("articles-detail", kwargs={"pk": 1}, request=request, format=format),
            },
            "comments": {
                # Example URLs (replace ids with real ones)
                "article_comments_example": reverse(
                    "article-comments",
                    kwargs={"article_id": 1},
                    request=request,
                    format=format,
                ),
                "comment_detail_example": reverse(
                    "comment-detail",
                    kwargs={"pk": 1},
                    request=request,
                    format=format,
                ),
            },
        }
    )
