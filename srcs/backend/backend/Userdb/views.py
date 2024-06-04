from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from .serializer import UserSerializer
import json

@api_view(['GET', 'POST'])
def user_list(request):
	if request.method == 'GET':
		users = User.objects.all()
		serializer = UserSerializer(users, many=True)
		return Response(serializer.data)
	elif request.method == 'POST':
		content = request.data.get('_content')
		data = json.loads(content)
		serializer = UserSerializer(data=data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view((['GET']))
def user_details(request, pk):
	try:
		user = User.objects.get(pk=pk)
	except User.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	if request.method == 'GET':
		serializer = UserSerializer(user)
		return Response(serializer.data)
	return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view((['GET']))
def user_details_name(request, name):
	try:
		user = User.objects.get(name=name)
	except User.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	if request.method == 'GET':
		serializer = UserSerializer(user)
		return Response(serializer.data)
	return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def user_login(request):
	if request.user.is_authenticated:
		user = request.user
		data = {'name': user.name, 'email': user.email, 'pk': user.pk}
		return Response(data, status=200)
	else:
		return Response({'error': 'User is not authenticated'}, status=403)