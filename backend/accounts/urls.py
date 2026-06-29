from django.urls import path
from .views import RegisterUserAPIView, LoginUserAPIView

urlpatterns = [
    path('register/', RegisterUserAPIView.as_view(), name='register-user'),
    path('login/', LoginUserAPIView.as_view(), name='login-user'),
]