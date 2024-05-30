from django.test import TestCase
from .models import User, UserManager

class userTestCase(TestCase):

	def setup(self):
		self.user_manager = UserManager()
		self.user = self.user_manager.create_user(
			email="testuser@example.com",
			name="TestUser",
			login42="test42",
			password="password123"
		)