from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'is_staff', 'is_superuser']


class ManagerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=6)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'password',
            'is_staff',
            'is_superuser',
            'is_active',
            'last_login',
            'date_joined'
        ]
        read_only_fields = ['last_login', 'date_joined']

    def validate_username(self, value: str):
        qs = User.objects.filter(username=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('用户名已存在')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None) or 'admin123'
        validated_data.setdefault('is_staff', True)
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
