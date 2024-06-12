from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from Userdb.models import User
from django.shortcuts import redirect, render
from .forms import RegisterForm
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
import json
import random
import string

def random_digit_gen(n=6):
    return ''.join(random.choices(string.digits, k=n))


def signupView(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            return redirect('login')
    else:
        form = RegisterForm()
    return render(request, 'registration/signup.html', {'form': form})


@api_view(['POST'])
@permission_classes([AllowAny])
def loginView(request):

    print (request.content_type)
    if request.content_type != 'application/json':
        return Response({'details':'Media type not supported, expected application/json!'}, status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return Response({'details':'Invalid Json!'}, status=status.HTTP_400_BAD_REQUEST)
    
    user_email = data.get('email')
    password = data.get('password')

    if not user_email or password:
        return Response({'details':'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=user_email)
    except User.DoesNotExist:
        return Response({'details':'Invalid email'}, status=status.HTTP_401_UNAUTHORIZED)

    if check_password(password, user.password):
        #go to the user table and select the correct user
        user_profile = User.objects.get(email=user_email)
        #add the code to the user table so the user has his own code
        verification_code = random_digit_gen
        user_profile.otp = verification_code
        user_profile.otp_expiry_time = timezone.now() + timedelta(hours=1)
        user_profile.save()
        #send the email to the user
        send_mail(
            'Ft_transcendence verification code',#subject
            'backEndWantYourLocation@backEnd.com',#the from email
            [user_email],#the recipient email
            fail_silently=False,#if false, send_email will raise a exception if an error occurs
        )
        return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)

    return Response({'detail': 'Invalid credentials!.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify(request):
    #get the email password otp from the request
    email = request.data.get('email')
    password = request.data.get('password')
    otp = request.data.get('otp')
    #check the user's credentials with the db
    user = authenticate(request, email=email, password=password)

    if user is not None:
        #go in the db to get the specified user
        user_profile = User.objects.get(user=user)

    if (
        #check if the verification code is valid
        user_profile.otp == otp and
        user_profile.otp_expiry_time is not None and
        user_profile.otp_expiry_time > timezone.now
    ):
        #generate token for the user
        refresh = RefreshToken.for_user(user);
        access_token = str(refresh.access_token)
        #reset the otp in the db so its ready for the next one
        user_profile.otp = '';
        user_profile.otp_expiry_time = None
        user_profile.save()

        return Response({'access_token': access_token, 'refresh_token': str(refresh)}, status=status.HTTP_200_OK)

    return Response({'detail': 'Invalid verification code or credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
