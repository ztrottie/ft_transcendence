from django.urls import path

from .views import signupView, logoutView


urlpatterns = [
    path("signup/", signupView, name="signup"),
	path("logout/", logoutView, name="logout"),
]