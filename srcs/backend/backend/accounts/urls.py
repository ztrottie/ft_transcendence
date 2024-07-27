from django.urls import path

# from rest_framework_simplejwt.views import (
    # TokenObtainPairView,
    # TokenRefreshView,
# )

from .views import loginView, logoutView, verify, signupView, get_csrf_token


urlpatterns = [
    path("signup/", signupView, name="signup"),
    path("login/", loginView, name="login"),
    path("logout/", logoutView.as_view(), name="logout"),
    path("get_csrf_token/", get_csrf_token, name="csrf_token"),
    path('verify/', verify, name="verify")

]