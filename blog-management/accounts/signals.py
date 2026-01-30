from django.contrib.auth.models import Group
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def add_user_to_default_group(sender, instance, created, **kwargs):
    if not created:
        return

    group, _ = Group.objects.get_or_create(name="user")
    instance.groups.add(group)
