from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import LoginView, ManagerViewSet, MeView

router = DefaultRouter()
router.register('managers', ManagerViewSet, basename='managers')

urlpatterns = [
    path('login', LoginView.as_view(), name='login'),
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('me', MeView.as_view(), name='me'),
    path('', include(router.urls)),
]
