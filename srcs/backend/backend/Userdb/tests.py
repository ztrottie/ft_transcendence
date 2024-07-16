from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.hashers import check_password
from .models import User
from .serializer import UserSerializer
from rest_framework.renderers import JSONRenderer
from django.contrib.auth import login, logout
from django.http import HttpRequest

class userTestCase(TestCase):

	def testUserCreation(self):
		#check si la creation de user se passe bien
		user = User.objects.create_user(
			email="testuser@example.com",
			name="TestUser",
			login42="test42",
			password="password123"
		)
		self.assertEqual(user.name, "TestUser")
		self.assertEqual(user.email, "testuser@example.com")
		self.assertEqual(user.login42, "test42")
		self.assertTrue(user.check_password("password123"))
		self.assertFalse(user.admin)
		self.assertFalse(user.is_staff)
		self.assertEqual(user.get_login42(), "test42")
		self.assertEqual(user.get_avatar(), "NULL")
		self.assertEqual(user.get_name_in_tournement(), "NULL")
		self.assertEqual(user.get_status_type_id(), 0)

	def testSuperUserCreation(self):
		#check si la creation de superuser se passe bien
		superuser = User.objects.create_superuser(
			email="superuser@example.com",
			name="SuperUser",
			login42="super42",
			password="password123"
		)
		self.assertEqual(superuser.email, "superuser@example.com")
		self.assertEqual(superuser.name, "SuperUser")
		self.assertEqual(superuser.login42, "super42")
		self.assertTrue(superuser.check_password("password123"))
		self.assertTrue(superuser.admin)
		self.assertTrue(superuser.is_staff)
		self.assertEqual(superuser.get_login42(), "super42")
		self.assertEqual(superuser.get_avatar(), "NULL")
		self.assertEqual(superuser.get_name_in_tournement(), "NULL")
		self.assertEqual(superuser.get_status_type_id(), 0)

	def testUserList(self):
		#check si la list est bien complete et fonctionnel
		user = User.objects.create_user(
			email="testuser@example.com",
			name="TestUser",
			login42="test42",
			password="password123"
		)
		user2 = User.objects.create_user(
			email="testuser2@example.com",
			name="TestUser2",
			login42="test422",
			password="password123"
		)
		client = Client()
		url = reverse('User-List')
		response = client.get(url)
		self.assertEqual(response.status_code, 200)
		serializer = UserSerializer([user, user2], many=True)
		expected_data = JSONRenderer().render(serializer.data)
		self.assertEqual(response.content, expected_data)
		#check la request si il n'y a pas de user dans la db
		user.delete()
		user2.delete()
		response = client.get(url)
		self.assertEqual(response.status_code, 200)
		expected_data = JSONRenderer().render([])
		self.assertEqual(response.content, expected_data)


	def testUserDetails(self):
		#Check si le details fonctionne comme prévu
		user = User.objects.create_user(
			email="testuser@example.com",
			name="TestUser",
			login42="test42",
			password="password123"
		)
		user2 = User.objects.create_user(
			email="testuser2@example.com",
			name="TestUser2",
			login42="test422",
			password="password123"
		)
		client = Client()
		url = reverse('User-Details', kwargs={'pk': user.pk})
		response = client.get(url)
		self.assertEqual(response.status_code, 200)
		serializer = UserSerializer(user2)
		expected_data = JSONRenderer().render(serializer.data)

		self.assertNotEqual(response.content, expected_data)
		serializer = UserSerializer(user)
		expected_data = JSONRenderer().render(serializer.data)
		self.assertEqual(response.content, expected_data)

	def testUserDetailsName(self):
		#Check si le details avec le nom comme parametre fonctionne comme prévu
		user = User.objects.create_user(
			email="testuser@example.com",
			name="TestUser",
			login42="test42",
			password="password123"
		)
		user2 = User.objects.create_user(
			email="testuser2@example.com",
			name="TestUser2",
			login42="test422",
			password="password123"
		)
		client = Client()
		url = reverse('User-Details', kwargs={'name': user.name})
		response = client.get(url)
		self.assertEqual(response.status_code, 200)
		serializer = UserSerializer(user2)
		expected_data = JSONRenderer().render(serializer.data)

		self.assertNotEqual(response.content, expected_data)
		serializer = UserSerializer(user)
		expected_data = JSONRenderer().render(serializer.data)
		self.assertEqual(response.content, expected_data)

