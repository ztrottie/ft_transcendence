from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from Userdb.models import User
from django.shortcuts import redirect, render
from .forms import RegisterForm, LoginForm, OTPForm
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
from django.middleware import csrf
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

@api_view(['GET'])
def get_csrf_token(request):
    token = get_token(request)
    return Response({'csrfToken': token}, status=status.HTTP_200_OK)

@api_view(('GET','POST'))
@permission_classes([AllowAny])
def loginView(request):
    form = LoginForm()
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = authenticate(username=form.cleaned_data['email'], password=form.cleaned_data['password'])
            if user is not None:
                #go to the user table and select the correct user
                user_profile = User.objects.get(email=request.POST["email"])
                #add the code to the user table so the user has he mail is own code
                verification_code = random_digit_gen()
                user_profile.otp = verification_code
                user_profile.otp_expiry_time = timezone.now() + timedelta(hours=1)
                user_profile.save()
                #send the email to the user
                send_mail(
                    'Ft_transcendence verification code',#subject
                    f'Here is your one time code!\n{user_profile.otp}',#message in the email
                    settings.EMAIL_HOST,#the from email
                    [user_profile.email],#the recipient email
                    fail_silently=False,#if false, send_email will raise a exception if an error occurs
                )
                return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)
            return Response({'detail': 'Invalid email and/or password'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'details':'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    return render(request, 'registration/login.html')

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
        
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def verify(request):
    form = OTPForm()
    if request.method == 'POST':
        form = OTPForm(request.POST)
        if form.is_valid():
            user = authenticate(username=form.cleaned_data['email'], password=form.cleaned_data['password'])
            if user is not None:
                user_profile = User.objects.get(email=request.POST["email"])
                if (
                    #check if the verification code is valid
                    user_profile.otp == request.POST["otp"] and
                    user_profile.otp_expiry_time is not None and
                    user_profile.otp_expiry_time > timezone.now()
                ):
                    response = Response()
                    print('before get token')
                    data = get_tokens_for_user(user)
                    print('after get token')
                    response.set_cookie(
                        key = settings.SIMPLE_JWT['AUTH_COOKIE'],
                        value = data["refresh"],
                        expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                        secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                        httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                        samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                    )
                    csrf.get_token(request)
                    response.data = {"Success" : "Login successfully","data":data}
                    login(request, user)
                    #reset the otp in the db so its ready for the next one
                    user_profile.otp = ''
                    user_profile.otp_expiry_time = None
                    user_profile.save()
                    return response
            return Response({'detail': 'Already register'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'detail': 'Invalid verification code or credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class logoutView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        if self.request.data.get('all'):
            token: OutstandingToken
            for token in OutstandingToken.objects.filter(user=request.user):
                _, _ = BlacklistedToken.objects.get_or_create(token=token)
            return Response({"status": "OK, goodbye, all refresh tokens blacklisted"})
        refresh_token = self.request.data.get('refresh_token')
        token = RefreshToken(token=refresh_token)
        token.blacklist()
        logout(request)
        return Response("Successful")