from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenVerifySerializer
from .models import User
from django.conf import settings
from .serializer import UserSerializer
import json
import jwt

class user_list(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,]

    def get(self, request):
        try:
            users = User.objects.exclude(name=request.user)
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)
        except:
            return Response([])

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

class user_login(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        try:
            return Response([{'detail': 'O\'sullivan, it\'s work'}], status=status.HTTP_200_OK)
        except:
            return Response({})