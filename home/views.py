from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.http import Http404
from .models import *
from .forms import *
from datetime import date as dt
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@login_required(login_url='login:login', redirect_field_name='next')
def index(request):
    form1 = CategoryForm()
    form2 = TodoItemForm(int(request.user.id))
    
    todos = TodoItem.objects.filter(category__user=request.user).order_by('date_to_complete')
    # Adicionar os links de LinkToTodo para cada todo relacionada.
    for todo in todos:
        todo.link = LinkToTodoItem.objects.filter(todo_item=todo)
    # converter data para formato brasileiro
    for todo in todos:
        todo.date_to_complete = todo.date_to_complete.strftime('%d/%m/%Y')
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
    
@login_required(login_url='login:login', redirect_field_name='next')
def edit_todo(request, pk):
    
    todo = TodoItem.objects.filter(pk=pk).first()
    if todo:
        if request.user == todo.category.user:
            if request.POST:
                POST = request.POST.copy()
                if POST['titulo'] != '':
                    todo.title = POST['titulo']
                if POST['descricao'] != '':
                    todo.description = POST['descricao']
                if POST['data'] != '':
                    todo.date_to_complete = POST['data']
                if POST['categoria'] != '':
                    if int(POST['categoria']) in list(Category.objects.filter(user=request.user).values_list('id', flat=True)):
                        todo.category = Category.objects.filter(pk=POST['categoria']).first()
                todo.save()
                return redirect(reverse('home:home'))
        else:
            return redirect(reverse('home:home'))
    return redirect(reverse('home:home'))
    

@login_required(login_url='login:login', redirect_field_name='next')
def delete_todo(request, pk):
    todo = TodoItem.objects.filter(pk=pk).first()
    if todo:
        if request.user == todo.category.user:    
            todo.delete()
            return redirect(reverse('home:home'))
        else:
            return redirect(reverse('home:home'))
    else:
        return redirect(reverse('home:home'))
    
def redirector(request, way):
    
    return render(request, "home/page/redirect.html", context={
        'way': way
        }
    )

def add_link(request, pk):
    if not request.POST:
        raise Http404()
    
    POST = request.POST.copy()
    if POST['link'] != '':
        if request.user == TodoItem.objects.filter(pk=pk).first().category.user:
            link = LinkToTodoItem()
            link.url = POST['link']
            link.title = POST['title']
            print(link.url)
            print(link.title)
            todo = TodoItem.objects.filter(pk=pk).first()
            link.todo_item = todo
            link.save()

    return redirect(reverse('home:home'))

def delete_link(request, pk):
    link = LinkToTodoItem.objects.filter(pk=pk).first()
    if link:
        if request.user == link.todo_item.category.user:
            link.delete()
            return redirect(reverse('home:home'))
        else:
            return redirect(reverse('home:home'))
    else:
        return redirect(reverse('home:home'))