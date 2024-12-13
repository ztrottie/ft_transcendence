from rest_framework_simplejwt import TokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import User

class UserProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		# What is possible to get not necessarily 
		fields = ('otp', 'otp-expiry-time', 'email', 'password')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	@classmethod
	def get_token(cls, user):
		token = super().get_token(user)
		token['name'] = user.name
		token['id'] = user.id
		return token
