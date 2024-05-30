from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import signup
from .views import TokenPairSerializer


urlpatterns = [
    path("signup/", signup, name="signup"),
    path('api/token/', TokenPairSerializer.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]