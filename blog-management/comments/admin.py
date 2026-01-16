from django.contrib import admin

# Register your models here.
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "article", "author", "created_at")
    search_fields = ("content", "author__username", "article__title")
    list_filter = ("created_at",)
