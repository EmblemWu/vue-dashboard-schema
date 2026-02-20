from django.contrib.auth.models import User


def build_permission_codes(user: User) -> list[str]:
    if user.is_superuser:
        return [
            'overview.read',
            'categories.read',
            'categories.write',
            'products.read',
            'products.write',
            'orders.read',
            'orders.write',
            'users.read',
            'users.write',
            'coupons.read',
            'coupons.write',
            'notices.read',
            'notices.write',
            'settings.read',
            'settings.write',
            'managers.read',
            'managers.write',
        ]

    if user.is_staff:
        return [
            'overview.read',
            'categories.read',
            'categories.write',
            'products.read',
            'products.write',
            'orders.read',
            'orders.write',
            'users.read',
            'users.write',
            'coupons.read',
            'coupons.write',
            'notices.read',
            'notices.write',
            'settings.read',
            'settings.write',
            'managers.read',
        ]

    return ['overview.read']
