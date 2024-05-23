from django.urls import path

from .views import signup, logout


urlpatterns = [
    path("signup/", signup, name="signup"),
	path("logout/", logout, name="logout"),
]