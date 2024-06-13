from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from Userdb.models import User
from .models import Relation, RelationType
from .serializer import RelationSerializer

@api_view((['Get']))
def userRelation(request, pk):
	try:
		relation = Relation.objects.filter(Q(User1Id=pk) | Q(User2Id=pk))
		if not relation.exists():
			return Response()
		serializer = RelationSerializer(relation, many=True)
		return Response(serializer.data)
	except Relation.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)

@api_view((['Get']))
def userAddFriend(request, name1, name2):
	try:
		user1 = User.objects.get(name=name1)
	except User.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	try:
		user2 = User.objects.get(name=name2)
	except User.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	try:
		relationExist = Relation.objects.filter(Q(User1Id=user1.pk, User2Id=user2.pk) | Q(User1Id=user2.pk, User2Id=user1.pk)).exists()
		if relationExist:
			return Response("This Relation is already created", status=status.HTTP_403_FORBIDDEN)
	except Relation.DoesNotExist:
		return Response(status=status.HTTP_404_NOT_FOUND)
	relationtype = RelationType.objects.get(pk=1)
	Relation.objects.create(User1Id=user1, User2Id=user2, RelationTypeId=relationtype)
	return Response(status=status.HTTP_201_CREATED)