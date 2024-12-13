from rest_framework import serializers
from .models import Match

class matchSerializer(serializers.ModelSerializer):
	class Meta:
		model = Match
		fields = '__all__'