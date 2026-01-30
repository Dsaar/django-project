from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrOwner(BasePermission):
    """
    - Admin (is_staff) can do anything
    - Authenticated owner can update/delete their own object
    - Anyone can read
    """

    def has_permission(self, request, view):
        # Always allow read-only requests
        if request.method in SAFE_METHODS:
            return True

        # Must be logged in for write actions
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # Always allow read-only requests
        if request.method in SAFE_METHODS:
            return True

        # Admin can do anything
        if request.user.is_staff:
            return True

        # Owner can edit/delete their own article
        return getattr(obj, "author_id", None) == getattr(request.user, "id", None)
