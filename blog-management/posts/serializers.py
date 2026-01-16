from rest_framework import serializers
from .models import Article, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Article
        fields = ("id", "title", "content", "published_at", "author_name", "tags")

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        request = self.context.get("request")

        article = Article.objects.create(author=request.user, **validated_data)

        for t in tags_data:
            name = t.get("name", "").strip()
            if not name:
                continue
            tag_obj, _ = Tag.objects.get_or_create(name=name)
            article.tags.add(tag_obj)

        return article

    def update(self, instance, validated_data):
        tags_data = validated_data.pop("tags", None)

        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        if tags_data is not None:
            instance.tags.clear()
            for t in tags_data:
                name = t.get("name", "").strip()
                if not name:
                    continue
                tag_obj, _ = Tag.objects.get_or_create(name=name)
                instance.tags.add(tag_obj)

        return instance
