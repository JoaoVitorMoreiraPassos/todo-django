from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.http import Http404
from .models import Category, TodoItem, LinkToTodoItem
from .forms import CategoryForm, TodoItemForm
from django.http import JsonResponse
from urllib.parse import urlparse
from datetime import datetime


# Create your views here.
@login_required(login_url="login:login", redirect_field_name="next")
def index(request):
    form1 = CategoryForm()
    form2 = TodoItemForm(int(request.user.id))
    todos = TodoItem.objects.filter(category__user=request.user).order_by(
        "date_to_complete"
    )
    # Adicionar os links de LinkToTodo para cada todo relacionada.
    for todo in todos:
        todo.link = LinkToTodoItem.objects.filter(todo_item=todo)
    # converter data para formato brasileiro
    for todo in todos:
        days_to_complete = todo.date_to_complete - datetime.now().date()
        if days_to_complete.days < 2:
            todo.priority = "deadline"
        elif days_to_complete.days < 5:
            todo.priority = "near-deadline"
        elif days_to_complete.days < 7:
            todo.priority = "normal-term"
        else:
            todo.priority = "long-term"
        todo.date_to_complete = todo.date_to_complete.strftime("%d/%m/%Y")
    return render(
        request,
        "home/page/index.html",
        context={
            "form1": form1,
            "form2": form2,
            "categories": Category.objects.filter(user=request.user),
            "todos": todos,
        },
    )


@login_required(login_url="login:login", redirect_field_name="next")
def get_categories(request):
    if request.method == "POST":
        categories = Category.objects.filter(user=request.user)
        categories = list(categories.values("id", "name"))
        print(categories)
        return JsonResponse({"categories": categories})


@login_required(login_url="login:login", redirect_field_name="next")
def edit_todo(request, pk):
    todo = TodoItem.objects.filter(pk=pk).first()
    if todo:
        if request.user == todo.category.user:
            if request.POST:
                POST = request.POST.copy()
                if POST["title"] != "":
                    todo.title = POST["title"]
                if POST["description"] != "":
                    todo.description = POST["description"]
                if POST["date_to_complete"] != "":
                    todo.date_to_complete = POST["date_to_complete"]
                if POST["category"] != "":
                    categorys = Category.objects.filter(user=request.user)
                    categorys = list(categorys.values_list("id", flat=True))
                    if int(POST["category"]) in categorys:
                        todo.category = Category.objects.filter(
                            pk=POST["category"]
                        ).first()
                todo.save()
                response = {
                    "status": "ok",
                    "title": POST["title"],
                    "description": POST["description"],
                    "date_to_complete": POST["date_to_complete"],
                    "category": Category.objects.filter(pk=POST["category"])
                    .first()
                    .name,
                }
                return JsonResponse(response)
        else:
            return redirect(reverse("home:home"))
    return redirect(reverse("home:home"))


@login_required(login_url="login:login", redirect_field_name="next")
def delete_todo(request, pk):
    todo = TodoItem.objects.filter(pk=pk).first()
    if todo:
        if request.user == todo.category.user:
            todo.delete()
            return JsonResponse({"status": "ok"})
        else:
            return JsonResponse({"status": "error"})
    else:
        return JsonResponse({"status": "error"})


def redirector(request, way):
    return render(request, "home/page/redirect.html", context={"way": way})


@login_required(login_url="login:login", redirect_field_name="next")
def add_link(request, pk):
    if not request.POST:
        raise Http404()
    POST = request.POST.copy()
    if POST["link"] != "":
        user = TodoItem.objects.filter(pk=pk).first().category.user
        if request.user == user:
            url = POST["link"]
            if url == "":
                return JsonResponse({"status": "erro", "message": "URL inválido"})
            try:
                # Analisar o URL
                parsed_url = urlparse(url)

                # Verificar se o URL possui um esquema válido
                if not parsed_url.scheme and not parsed_url.scheme.startswith(
                    ("http", "https")
                ):
                    return JsonResponse({"status": "erro", "message": "URL inválido"})

                # Verificar se o URL possui um domínio válido
                if not parsed_url.netloc:
                    return JsonResponse({"status": "erro", "message": "URL inválido"})

                # Verificar se o URL possui um caminho válido
                if not parsed_url.path:
                    return JsonResponse({"status": "erro", "message": "URL inválido"})

            except ValueError:
                return JsonResponse({"status": "erro", "message": "URL inválido"})
            link = LinkToTodoItem()
            link.url = url
            link.title = POST["title"]
            if link.title == "":
                link.title = link.url
            todo = TodoItem.objects.filter(pk=pk).first()
            link.todo_item = todo
            link.save()
            return JsonResponse(
                {
                    "status": "ok",
                    "title": link.title,
                    "url": link.url,
                    "id": link.id,
                    "bg": POST["bg"],
                }
            )
    return JsonResponse({"status": "erro", "message": "URL inválido"})


@login_required(login_url="login:login", redirect_field_name="next")
def delete_link(request, pk):
    if not request.POST:
        raise Http404()
    POST = request.POST.copy()
    if POST["id"] != "":
        user = TodoItem.objects.filter(pk=pk).first().category.user
        print(user, request.user)
        if request.user == user:
            print(POST["id"], type(POST["id"]))
            link = LinkToTodoItem.objects.filter(pk=int(POST["id"])).first()
            print(link)
            if link:
                link.delete()
                return JsonResponse({"status": "ok"})
    return JsonResponse({"status": "error"})
