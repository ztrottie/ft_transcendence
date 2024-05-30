from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'password')


# Will be use when the user logs in.
#It will handle the generation of the token
# And authentication of the user
class TokenPairSerializer(TokenObtainPairSerializer):

    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        # AKA send more user info within the token response.
        # Doing so reduce the api calls the front-end will have to make since it already has more info
        token['username'] = user.username
        return token

    def validate(self, attrs):
        #check the user name and password with the data base
        #it also generate tokens for the user
        data = super().validate(attrs)
        #self.user is the validated user 
        data.update({'user': UserSerializer(self.user).data})
        return data 