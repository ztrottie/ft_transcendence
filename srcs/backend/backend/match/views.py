from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Match
from .serializer import matchSerializer
import json

@api_view(['GET', 'POST'])
def match(request):
	if request.method == 'GET':
		matchs = Match.objects.all()
		serializer = matchSerializer(matchs, many=True)
		return Response(serializer.data)
	elif request.method == 'POST':
		content = request.data.get('_content')
		data = json.loads(content)
		serializer = matchSerializer(data=data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)