from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.apps import apps

GROUPS = {
    # can fully manage everything
    "admin": {
        "all_permissions": True,
    },
    # can create posts, edit own posts, delete own posts (permissions handled in DRF)
    "writer": {
        "model_perms": {
            "posts.Article": ["add_article"],
            "comments.Comment": ["add_comment"],
        }
    },
    # normal authenticated user: can comment; ownership rules still enforced in DRF
    "user": {
        "model_perms": {
            "comments.Comment": ["add_comment"],
        }
    },
}

class Command(BaseCommand):
    help = "Create default groups and attach permissions (idempotent)."

    def handle(self, *args, **options):
        for group_name, config in GROUPS.items():
            group, _ = Group.objects.get_or_create(name=group_name)

            if config.get("all_permissions"):
                group.permissions.set(Permission.objects.all())
                self.stdout.write(self.style.SUCCESS(f"✓ Group '{group_name}' -> ALL permissions"))
                continue

            perms_to_set = []
            model_perms = config.get("model_perms", {})
            for model_label, perm_codenames in model_perms.items():
                app_label, model_name = model_label.split(".")
                model = apps.get_model(app_label, model_name)

                for codename in perm_codenames:
                    perm = Permission.objects.get(
                        content_type__app_label=app_label,
                        codename=codename,
                    )
                    perms_to_set.append(perm)

            group.permissions.set(perms_to_set)
            self.stdout.write(self.style.SUCCESS(f"✓ Group '{group_name}' -> {len(perms_to_set)} perms"))

        self.stdout.write(self.style.SUCCESS("Done."))
