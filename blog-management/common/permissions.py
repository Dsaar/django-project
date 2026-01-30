from rest_framework.permissions import BasePermission, SAFE_METHODS

def user_in_group(user, group_name: str) -> bool:
    if not user or not user.is_authenticated:
        return False
    # superuser override is nice to keep
    if getattr(user, "is_superuser", False):
        return True
    return user.groups.filter(name=group_name).exists()

def user_in_any_group(user, group_names: list[str]) -> bool:
    return any(user_in_group(user, g) for g in group_names)

class IsInGroups(BasePermission):
    """
    Allow if user is in ANY of the provided groups.
    Usage: IsInGroups(["admin", "writer"])
    """
    def __init__(self, groups):
        self.groups = groups

    def has_permission(self, request, view):
        return user_in_any_group(request.user, self.groups)

class IsAuthenticatedOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated)

class IsOwnerOrAdminGroup(BasePermission):
    """
    Object-level: owner can edit/delete their own objects.
    Admin group can edit/delete any object.
    """
    owner_field = "author"  # override in subclass if needed

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        if user_in_group(request.user, "admin"):
            return True

        owner = getattr(obj, self.owner_field, None)
        return bool(owner and owner == request.user)

class IsCommentOwnerOrAdminGroup(IsOwnerOrAdminGroup):
    owner_field = "author"
