from django.conf import settings
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Profile


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile_and_default_group(sender, instance, created, **kwargs):
    if not created:
        return

    # Create Profile automatically
    Profile.objects.get_or_create(user=instance)

    # Put new users in default group "user"
    group, _ = Group.objects.get_or_create(name="user")
    instance.groups.add(group)
