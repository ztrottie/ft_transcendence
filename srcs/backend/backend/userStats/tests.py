from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.hashers import check_password
from .models import userStats
from Userdb.models import User
from .serializer import userStatsSerializer
from rest_framework.renderers import JSONRenderer
from django.contrib.auth import login, logout
from django.http import HttpRequest
# Create your tests here.

class userStatsTestCase(TestCase):

	def testUserStatsCreation(self):
		user = User.objects.create_user(
			email="testuser@example.com",
			name="TestUser",
			login42="test42",
			password="password123"
		)
		UserStats = userStats.objects.get(user=user.pk)
		self.assertEqual(UserStats.user, user)
		self.assertEqual(UserStats.win, 0)
		self.assertEqual(UserStats.lost, 0)
		self.assertEqual(UserStats.goal, 0)

	def testUserStatsEmpty(self):
		user = User.objects.create_user(
			email="testuser@example.com",
			name="TestUser",
			login42="test42",
			password="password123"
		)
		UserStats = userStats.objects.get(user=user.pk)
		self.assertIsNotNone(UserStats)
		user.delete()
		self.assertEqual(userStats.objects.count(), 0)
