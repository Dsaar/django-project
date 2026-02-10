"""
URL configuration for blog_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from blog_api.api_root import api_root
from .api_docs import api_docs



urlpatterns = [
    path("admin/", admin.site.urls),

    # API Root (Browsable index)
    path("api/", api_root, name="api-root"),

    # JWT auth
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Browsable API login/logout (session auth for the browsable UI)
    path("api-auth/", include("rest_framework.urls")),

    # Full API docs hub
    path("api-auth/", include(("rest_framework.urls", "rest_framework"), namespace="rest_framework")),


    # App APIs (will be added gradually)
    path("api/", include("accounts.urls")),
    path("api/", include("posts.urls")),
    path("api/", include("comments.urls")),
]
