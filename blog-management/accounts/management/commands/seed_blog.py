# accounts/management/commands/seed_blog.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from posts.models import Article, Tag
from comments.models import Comment

User = get_user_model()

UNSPLASH_1 = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
UNSPLASH_2 = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"

AVATAR_1 = "https://i.pravatar.cc/150?img=12"
AVATAR_2 = "https://i.pravatar.cc/150?img=32"


class Command(BaseCommand):
    help = "Seed database with users, travel posts (with images), tags and comments"

    def handle(self, *args, **options):
        self.stdout.write("Seeding blog data...")

        # ─────────────────────────────
        # 1) USERS
        # ─────────────────────────────
        writer_admin, _ = User.objects.get_or_create(
            username="writeradmin",
            defaults={
                "email": "writeradmin@example.com",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        writer_admin.set_password("Admin123!")
        writer_admin.save()

        regular_user, _ = User.objects.get_or_create(
            username="traveler",
            defaults={"email": "traveler@example.com"},
        )
        regular_user.set_password("User123!")
        regular_user.save()

        # ensure profiles exist + set avatar urls
        # (works if you added Profile + signals + related_name="profile")
        writer_admin.profile.avatar_url = AVATAR_1
        writer_admin.profile.display_name = "Admin Writer"
        writer_admin.profile.bio = "Writes travel guides and featured posts."
        writer_admin.profile.save()

        regular_user.profile.avatar_url = AVATAR_2
        regular_user.profile.display_name = "Travel Lover"
        regular_user.profile.bio = "Collecting stories from around the world."
        regular_user.profile.save()

        # ─────────────────────────────
        # 2) GROUPS
        # ─────────────────────────────
        try:
            admin_group = Group.objects.get(name="admin")
            writer_group = Group.objects.get(name="writer")
            user_group = Group.objects.get(name="user")
        except Group.DoesNotExist:
            self.stderr.write("❌ Groups not found. Run: python manage.py bootstrap_groups")
            return

        writer_admin.groups.add(admin_group, writer_group)
        regular_user.groups.add(user_group)

        # ─────────────────────────────
        # 3) TAGS (travel flavored)
        # ─────────────────────────────
        tag_travel, _ = Tag.objects.get_or_create(name="travel")
        tag_europe, _ = Tag.objects.get_or_create(name="europe")
        tag_beach, _ = Tag.objects.get_or_create(name="beach")

        # ─────────────────────────────
        # 4) ARTICLES (travel + image_url)
        # ─────────────────────────────
        article1, _ = Article.objects.get_or_create(
            title="Santorini in 3 Days: A First-Timer’s Itinerary",
            defaults={
                "content": (
                    "Whitewashed villages, cliffside sunsets, and calm morning walks in Oia.\n\n"
                    "Day 1: Oia + sunset viewpoints\n"
                    "Day 2: Fira to Oia hike + local food\n"
                    "Day 3: Beach time + winery stop\n"
                ),
                "author": writer_admin,
                "image_url": UNSPLASH_1,
            },
        )
        # keep seed idempotent: update fields if already exists
        article1.author = writer_admin
        article1.image_url = UNSPLASH_1
        article1.save()
        article1.tags.set([tag_travel, tag_europe])

        article2, _ = Article.objects.get_or_create(
            title="Mykonos vs. Santorini: Which Greek Island Should You Visit?",
            defaults={
                "content": (
                    "If you want nightlife and beach clubs, Mykonos wins.\n"
                    "If you want views, romance, and iconic scenery, choose Santorini.\n\n"
                    "This post breaks it down by budget, vibe, and season."
                ),
                "author": regular_user,
                "image_url": UNSPLASH_2,
            },
        )
        article2.author = regular_user
        article2.image_url = UNSPLASH_2
        article2.save()
        article2.tags.set([tag_travel, tag_beach])

        # ─────────────────────────────
        # 5) COMMENTS (2 comments across 2 posts)
        # ─────────────────────────────
        Comment.objects.get_or_create(
            content="Love this itinerary — the Fira to Oia hike was the highlight for me.",
            author=regular_user,
            article=article1,
        )

        Comment.objects.get_or_create(
            content="Great comparison. I’d add that shoulder season is the sweet spot for both islands.",
            author=writer_admin,
            article=article2,
        )

        self.stdout.write(self.style.SUCCESS("✅ Travel blog seed completed successfully"))
