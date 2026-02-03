from django.db import models
from django.conf import settings
# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    avatar_url = models.URLField(blank=True, null=True)
    display_name = models.CharField(max_length=80, blank=True, default="")
    bio = models.TextField(blank=True, default="")

    def __str__(self):
        return f"{self.user.username} profile"
