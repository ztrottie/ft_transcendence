from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import userStats
from Userdb.models import User
from .serializer import userStatsSerializer
import json

@api_view(['POST'])
def goal(request):
	if request.method == 'POST':
		try:
			content = request.data.get('_content')
			data = json.loads(content)
		except:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		try:
			user = User.objects.get(pk=pk)
			stats = userStats.objects.get(user=user)
		except User.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
		except userStats.DoesNotExist:
			return Response({"error": "UserStats not found"}, status=status.HTTP_404_NOT_FOUND)

		goal = data.get('goal')
		goal = int(goal)

		data = data.copy()
		stats.goal += goal
		stats.save()
		serializer = userStatsSerializer(stats, data=data, partial=True)
		if serializer.is_valid():
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def statistik(request, pk):
	if request.method == 'GET':
		try:
			stats = userStats.objects.get(user=pk)
		except userStats.DoesNotExist:
			return Response(status=status.HTTP_404_NOT_FOUND)
		goal = stats.goal
		return Response({'goal' : goal}, status=status.HTTP_200_OK)