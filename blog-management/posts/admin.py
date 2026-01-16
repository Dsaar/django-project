from django.contrib import admin

# Register your models here.
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "published_at")
    search_fields = ("title", "content", "author__username")
    list_filter = ("published_at",)
