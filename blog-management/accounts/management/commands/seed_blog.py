from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from posts.models import Article, Tag
from comments.models import Comment


User = get_user_model()


class Command(BaseCommand):
    help = "Seed database with users, posts, tags and comments"

    def handle(self, *args, **options):
        self.stdout.write("Seeding blog data...")

        # ─────────────────────────────
        # 1. USERS
        # ─────────────────────────────
        admin_user, _ = User.objects.get_or_create(
            username="adminuser",
            defaults={
                "email": "admin@example.com",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if not admin_user.has_usable_password():
            admin_user.set_password("Admin123!")
            admin_user.save()

        regular_user, _ = User.objects.get_or_create(
            username="regularuser",
            defaults={
                "email": "user@example.com",
            },
        )
        if not regular_user.has_usable_password():
            regular_user.set_password("User123!")
            regular_user.save()

        # ─────────────────────────────
        # 2. GROUPS (ASSUMES bootstrap_groups EXISTS)
        # ─────────────────────────────
        try:
            admin_group = Group.objects.get(name="admin")
            writer_group = Group.objects.get(name="writer")
            user_group = Group.objects.get(name="user")
        except Group.DoesNotExist:
            self.stderr.write(
                "❌ Groups not found. Run `python manage.py bootstrap_groups` first."
            )
            return

        admin_user.groups.add(admin_group)
        regular_user.groups.add(user_group)

        # ─────────────────────────────
        # 3. TAGS
        # ─────────────────────────────
        tag_django, _ = Tag.objects.get_or_create(name="django")
        tag_rest, _ = Tag.objects.get_or_create(name="rest")
        tag_api, _ = Tag.objects.get_or_create(name="api")

        # ─────────────────────────────
        # 4. ARTICLES
        # ─────────────────────────────
        article1, _ = Article.objects.get_or_create(
            title="Welcome to the Blog",
            defaults={
                "content": "This is the first seeded article.",
                "author": admin_user,
            },
        )
        article1.tags.set([tag_django, tag_rest])

        article2, _ = Article.objects.get_or_create(
            title="Regular User Post",
            defaults={
                "content": "This article was written by a regular user.",
                "author": regular_user,
            },
        )
        article2.tags.set([tag_api])

        # ─────────────────────────────
        # 5. COMMENTS
        # ─────────────────────────────
        Comment.objects.get_or_create(
            content="Admin comment on article 1",
            author=admin_user,
            article=article1,
        )

        Comment.objects.get_or_create(
            content="Regular user comment on article 2",
            author=regular_user,
            article=article2,
        )

        # ─────────────────────────────
        self.stdout.write(self.style.SUCCESS("✅ Blog seed completed successfully"))
