from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name")

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def validate_email(self, value):
        if value and User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    # expose user fields read-only via source
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = ("username", "email", "display_name", "bio", "avatar_url")


class MeSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False, allow_null=True)
    groups = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id", "username", "email", "first_name", "last_name",
            "is_staff", "is_superuser", "groups",
            "profile",
        )

    def get_groups(self, obj):
        return list(obj.groups.values_list("name", flat=True))

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", {})

        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()

        # ensure profile exists
        profile, _ = Profile.objects.get_or_create(user=instance)
        for attr, val in profile_data.items():
            setattr(profile, attr, val)
        profile.save()

        return instance