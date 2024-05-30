from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import RegisterForm
from .tokenSerializer import TokenPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView 


def signup(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('login')
    else:
        form = RegisterForm()
    return render(request, 'registration/signup.html', {'form': form})

class TokenSerializer(TokenObtainPairView):
    serializer_class = TokenPairSerializer