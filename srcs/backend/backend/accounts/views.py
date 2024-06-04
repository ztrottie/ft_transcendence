from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from .forms import RegisterForm

def signupView(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('login')
    else:
        form = RegisterForm()
    return render(request, 'registration/signup.html', {'form': form})

def logoutView(request):
    logout(request)
    return render(request, "registration/logout.html")