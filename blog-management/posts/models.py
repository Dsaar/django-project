from django.db import models

# Create your models here.
from django.contrib.auth.models import User


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    published_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="articles")
    tags = models.ManyToManyField(Tag, blank=True, related_name="articles")

    class Meta:
        ordering = ["-published_at"]

    def __str__(self):
        return self.title
