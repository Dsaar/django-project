from rest_framework import serializers
from .models import Article, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    tags_input = serializers.ListField(required=False, write_only=True)

    # if image_url is a model field, this is optional; keep it if you want allow_blank behavior
    image_url = serializers.URLField(required=False, allow_null=True, allow_blank=True)

    author_avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = (
            "id",
            "title",
            "content",
            "published_at",
            "author_name",
            "author_avatar_url",
            "image_url",
            "tags",
            "tags_input",
        )

    def get_author_avatar_url(self, obj):
        try:
            return obj.author.profile.avatar_url
        except Exception:
            return ""

    def _normalize_tags(self, raw_tags):
        if not raw_tags:
            return []

        names = []
        for t in raw_tags:
            if isinstance(t, str):
                name = t.strip()
            elif isinstance(t, dict):
                name = str(t.get("name", "")).strip()
            else:
                name = ""
            if name:
                names.append(name)

        seen = set()
        unique = []
        for n in names:
            key = n.lower()
            if key not in seen:
                unique.append(n)
                seen.add(key)
        return unique

    def create(self, validated_data):
        raw_tags = validated_data.pop("tags_input", [])
        tag_names = self._normalize_tags(raw_tags)

        request = self.context.get("request")
        article = Article.objects.create(author=request.user, **validated_data)

        for name in tag_names:
            tag_obj, _ = Tag.objects.get_or_create(name=name)
            article.tags.add(tag_obj)

        return article

    def update(self, instance, validated_data):
        raw_tags = validated_data.pop("tags_input", None)

        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        if raw_tags is not None:
            tag_names = self._normalize_tags(raw_tags)
            instance.tags.clear()
            for name in tag_names:
                tag_obj, _ = Tag.objects.get_or_create(name=name)
                instance.tags.add(tag_obj)

        return instance
