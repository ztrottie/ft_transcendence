from django.urls import path

# from rest_framework_simplejwt.views import (
	# TokenObtainPairView,
	# TokenRefreshView,
# )

from .views import loginView, logoutView, verify, signupView


urlpatterns = [
	path("signup/", signupView, name="signup"),
	path("login/", loginView, name="login"),
	path("logout/", logoutView.as_view(), name="logout"),
	path('verify/', verify, name="verify")

]