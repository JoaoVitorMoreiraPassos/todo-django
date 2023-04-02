from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.http import Http404
from .models import *
from .forms import *
from datetime import date as dt

# Create your views here.
@login_required(login_url='login:login', redirect_field_name='next')
def index(request):
    form1 = CategoryForm()
    form2 = TodoItemForm(int(request.user.id))
    
    todos = TodoItem.objects.filter(category__user=request.user).order_by('date_to_complete')
    
    return render(request, "home/page/index.html", context={
        'form1': form1,
        'form2': form2,
        'categories': Category.objects.filter(user=request.user),
        'todos': todos,
    })

@login_required(login_url='login:login', redirect_field_name='next')
def create_category(request):
    if not request.POST:
        raise Http404()
    
    POST = request.POST
    POST._mutable = True
    POST['user'] = request.user
    form = CategoryForm(POST)
    if form.is_valid():
        form.save()
        return redirect(reverse('home:home'))
    else:
        return redirect(reverse('home:home'))
    
@login_required(login_url='login:login', redirect_field_name='next')
def create_todo(request):
    if not request.POST:
        raise Http404()
    
    POST = request.POST.copy()
    form = TodoItemForm(request.user, POST)
    if form.is_valid():
        form.save()
        
    return redirect(reverse('home:home'))
    
def edit_todo(request, pk):
    ...

def delete_todo(request, pk):    
    TodoItem.objects.get(pk=pk).delete()
    return redirect(reverse('home:home'))