from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate, login as django_login
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from Userdb.models import User
from .serializer import UserProfileSerializer


def random_digit_gen(n=6):
    return "".join(map(str, random_sample(range(0, 10)), n))

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    #get the user email and password from the request
    email = request.data.query_params('email')
    password = request.data.query_params('password')
    #check the user credentials with the db
    user = authenticate(request, email=email, password=password)

    if user is not None:
        #go to the user table and select the correct user
        user_profile = User.objects.get(user=user)
        #add the code to the user table so the user has his own code
        verification_code = random_digit_gen
        user_profile_otp = verification_code
        user_profile_otp_expiry_time = timezone.now() + timedelta(hours=1)
        user_profile.save()
        #send the email to the user 
        send_mail(
            'Ft_transcendence verification code', #subject
            'backEndWantYourLocation@backEnd.com',#from email
            [email],#recipient email
            fail_silently=False,#if false, send_email will raise a exception if an error occurs
        )

        return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)

    return Response({'detail': 'Invalid credentials!.'}, status=status.HTTP_401_UNAUTHORIZED)

