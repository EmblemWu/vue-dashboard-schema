from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    message = '仅超级管理员可执行该操作'

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.is_superuser)
