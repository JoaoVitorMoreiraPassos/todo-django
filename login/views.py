from .forms import LoginForm
from django.http import Http404
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
#importar crsf

# Create your views here.
def login_view(request):
    
    form = LoginForm()

    return render(request, 'login/page/index.html', context ={
        'form': form, 
        'form_action': reverse('login:authorize'),
    })
        
def login_authorize(request):
    if not request.POST:
        raise Http404()
    
    POST = request.POST
    form = LoginForm(POST)
    login_url = reverse('login:login')
    
    if form.is_valid():
        authenticated_user = authenticate(
            username=form.cleaned_data.get('username', ''),
            password=form.cleaned_data.get('password', ''),
        )
        if authenticated_user:
            messages.success(request, 'Login realizado com sucesso!')
            login(request, authenticated_user)
            return redirect(reverse('home:home'))
        else:
            messages.error(request, 'Usuário ou senha não encontrados')
            
    return redirect(login_url)

@login_required(login_url='login:login', redirect_field_name='next')
def logout_view(request):
    if not request.POST:
        return redirect(reverse('login:login'))

    if request.POST.get('username') != request.user.username:
        return redirect(reverse('login:login'))

    logout(request)
    return redirect(reverse('login:login'))