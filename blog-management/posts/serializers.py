from rest_framework import serializers
from .models import Article, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)

    # Keep tags as nested objects in responses:
    tags = TagSerializer(many=True, read_only=True)

    # Allow input in either format:
    # 1) ["news", "django"]
    # 2) [{"name": "news"}, {"name": "django"}]
    tags_input = serializers.ListField(required=False, write_only=True)

    class Meta:
        model = Article
        fields = ("id", "title", "content", "published_at", "author_name", "tags", "tags_input")

    def _normalize_tags(self, raw_tags):
        """
        Converts incoming tags into a clean list of tag names.
        Accepts:
          - list[str]
          - list[dict] with {"name": "..."}
        """
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

        # optional: de-dupe while preserving order
        seen = set()
        unique = []
        for n in names:
            if n.lower() not in seen:
                unique.append(n)
                seen.add(n.lower())
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
