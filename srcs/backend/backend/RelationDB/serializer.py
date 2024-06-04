from rest_framework import serializers
from .models import Relation

class RelationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Relation
		fields = '__all__'
