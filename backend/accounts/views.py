from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.serializers import ManagerSerializer, UserSerializer


class LoginView(TokenObtainPairView):
    """JWT login endpoint."""


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = UserSerializer(request.user).data
        return Response(data)


class ManagerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = ManagerSerializer

    def get_queryset(self):
        return User.objects.filter(is_staff=True).order_by('-id')

    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        manager = self.get_object()
        password = request.data.get('password', 'admin123')
        if not password or len(password) < 6:
            return Response({'detail': '密码长度至少 6 位'}, status=status.HTTP_400_BAD_REQUEST)

        manager.set_password(password)
        manager.save(update_fields=['password'])
        return Response({'detail': '密码已重置'})
