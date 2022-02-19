from django.shortcuts import render
from task_app.models import *
from task_app.serializers import *
from rest_framework.authentication import TokenAuthentication
from rest_framework import permissions, authentication, viewsets, views, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import login
from django.contrib.auth import logout
from django.shortcuts import redirect
# Create your views here.

class RegistrationAPI(GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response(user)
        return Response(serializer.errors)


class UserLoginAPI(GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_data = User.objects.filter(username=request.data['username']).last()
        if user_data:
            login(request, user_data)
            token, created = Token.objects.get_or_create(user=serializer.validated_data['user'])
            request = {
                'user': serializer.validated_data['user']
            }
            response_serializer = UserLoginReplySerializer(token, context={'request': request})
            return Response({'status': 'True','message': 'Login successfully.',"data":response_serializer.data}, status=status.HTTP_200_OK)
        return Response({'status': 'False', 'message': 'There is no user register with this username.'}, status=status.HTTP_400_BAD_REQUEST)



class BlogViewSet(viewsets.ModelViewSet):
    serializer_class = Blog1Serializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['author', 'is_published',]

    def get_queryset(self):
        queryset = Blog.objects.filter(author=self.request.user)
        return queryset

    def create(self, request):
        serializer = self.get_serializer(data=request.data,)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer.save(author=self.request.user))
        return Response({'status': 'True', 'data':serializer.data}, status=status.HTTP_201_CREATED)

class BlogReadViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Blog.objects.filter(is_published=True)
    serializer_class = BlogSerializer
    permission_classes = (AllowAny,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['author', 'is_published',]

def LogoutView(request):
    logout(request)
    return redirect('/')