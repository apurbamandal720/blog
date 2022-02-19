from django.urls import path,include
from rest_framework.routers import DefaultRouter
from task_app.views import *

router = DefaultRouter()
router.register(r'blog', BlogViewSet, basename='blog')
router.register(r'blog-view', BlogReadViewSet, basename='blog-view')

urlpatterns = [
    path('', include(router.urls)),
    path('registration/', RegistrationAPI.as_view()),
    path('login/', UserLoginAPI.as_view(), name='login'),
    path('logout/', LogoutView, name='logout'),
]
