from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import loginView, verify, signupView


urlpatterns = [
    path("login/", loginView, name="login"),
    path("signup/", signupView, name="signup"),
    path("verify/", verify, name="verify"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]