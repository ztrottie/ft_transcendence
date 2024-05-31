from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
	statusTypeId = serializers.CharField()
	class Meta:
		model = User
		fields = ['id', 'name', 'email', 'login42', 'avatar', 'name_in_tournement', 'status_type_id', 'admin', 'is_staff', 'statusTypeId']

	def to_representation(self, instance):
		data = super().to_representation(instance)
		data.pop('password', None)  # Remove the 'password' field from the serialized data
		return data