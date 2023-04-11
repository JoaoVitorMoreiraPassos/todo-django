from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.http import Http404
from .models import Category, TodoItem, LinkToTodoItem
from .forms import CategoryForm, TodoItemForm
from django.http import JsonResponse
from urllib.parse import urlparse


# Create your views here.
@login_required(login_url='login:login', redirect_field_name='next')
def index(request):
    form1 = CategoryForm()
    form2 = TodoItemForm(int(request.user.id))
    todos = TodoItem.objects.filter(
                        category__user=request.user
                ).order_by('date_to_complete')
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
                    categorys = Category.objects.filter(user=request.user)
                    categorys = list(categorys.values_list('id', flat=True))
                    if int(POST['categoria']) in categorys:
                        todo.category = Category.objects.filter(
                                pk=POST['categoria']
                            ).first()
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


@login_required(login_url='login:login', redirect_field_name='next')
def add_link(request, pk):
    if not request.POST:
        raise Http404()
    POST = request.POST.copy()
    if POST['link'] != '':
        if (request.user ==
                TodoItem.objects.filter(pk=pk).first().category.user):
            url = POST['link']
            if url == '':
                return JsonResponse({'title': '', 'url': '', 'id': ''})
            try:
                # Analisar o URL
                parsed_url = urlparse(url)

                # Verificar se o URL possui um esquema válido
                if not parsed_url.scheme or not parsed_url.scheme.startswith(("http", "https")):
                    return JsonResponse({'title': '', 'url': '', 'id': ''})

                # Verificar se o URL possui um domínio válido
                if not parsed_url.netloc:
                    return JsonResponse({'title': '', 'url': '', 'id': ''})

                # Verificar se o URL possui um caminho válido
                if not parsed_url.path:
                    return JsonResponse({'title': '', 'url': '', 'id': ''})

                # Verificar outros aspectos, como parâmetros da query,
                # fragmento, etc.
                # Você pode adicionar mais validações de acordo com os
                # requisitos do seu projeto
            except ValueError:
                return JsonResponse({'title': '', 'url': '', 'id': ''})
            link = LinkToTodoItem()
            link.url = url
            link.title = POST['title']
            if link.title == '':
                link.title = link.url
            todo = TodoItem.objects.filter(pk=pk).first()
            link.todo_item = todo
            link.save()
            return JsonResponse({
                                'title': link.title,
                                'url': link.url,
                                'id': link.id
                                })
    return JsonResponse({'title': '', 'url': '', 'id': ''})


@login_required(login_url='login:login', redirect_field_name='next')
def delete_link(request, pk):
    if not request.POST:
        raise Http404()
    POST = request.POST.copy()
    if POST['id'] != '':
        user = TodoItem.objects.filter(pk=pk).first().category.user
        print(user, request.user)
        if (request.user == user):
            print(POST['id'], type(POST['id']))
            link = LinkToTodoItem.objects.filter(pk=int(POST['id'])).first()
            print(link)
            if link:
                link.delete()
                return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'error'})
