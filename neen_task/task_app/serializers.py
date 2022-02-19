from task_app.models import *
from rest_framework import serializers, exceptions
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone

class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        token = self.get_token(user)
        ctx = {
            'user': user.pk,
            'token': token
        }
        return ctx

    def get_token(self, obj):
        token = Token.objects.create(user=obj)
        return token.key

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=35)
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        user = authenticate(
            username=data['username'], password=data['password'])
        if not user:
            raise exceptions.AuthenticationFailed()
        elif not user.is_active:
            raise exceptions.PermissionDenied()

        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        data['user'] = user
        return data

class UserLoginReplySerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Token
        fields = ('key', 'user',)

class Blog1Serializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'
        read_only_fields = ('author',)

class User1Serializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk','first_name',)
        read_only_fields = ('first_name',)

class BlogSerializer(serializers.ModelSerializer):
    author = User1Serializer()
    class Meta:
        model = Blog
        fields = '__all__'
        read_only_fields = ('author','first_name',)
        