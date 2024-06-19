from rest_framework import serializers
from .models import userStats

class userStatsSerializer(serializers.ModelSerializer):
	class Meta:
		model = userStats
		fields = '__all__'