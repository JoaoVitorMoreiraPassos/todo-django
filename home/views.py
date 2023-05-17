from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.http import Http404
from .models import Category, TodoItem, LinkToTodoItem, User
from .forms import CategoryForm, TodoItemForm
from django.http import JsonResponse
from urllib.parse import urlparse
from datetime import datetime


# Create your views here.
@login_required(login_url="login:login", redirect_field_name="next")
def index(request):
    form1 = CategoryForm()
    form2 = TodoItemForm(int(request.user.id))
    todos = (
        TodoItem.objects.filter(category__user=request.user)
        .order_by("date_to_complete")
        .exclude(category__name="Completos")
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
            "todos": todos if len(todos) > 0 else False,
        },
    )


@login_required(login_url="login:login", redirect_field_name="next")
def get_categories(request):
    if request.method == "POST":
        categories = Category.objects.filter(user=request.user)
        categories = list(categories.values("id", "name"))
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
                todo.date_updated = datetime.now()
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
    invalid_response = {
        "status": "erro",
        "message": "URL inválido",
    }
    if not request.POST:
        raise Http404()
    POST = request.POST.copy()
    if POST["link"] != "":
        user = TodoItem.objects.filter(pk=pk).first().category.user
        if request.user == user:
            url = POST["link"]
            if url == "":
                return JsonResponse(invalid_response)
            # Deixa passar se a URL é um endereço local windows ou linux
            if not url.startswith(("\\", "file:/")):
                try:
                    # Analisar o URL
                    parsed_url = urlparse(url)

                    # Verificar se o URL possui um esquema válido
                    if not parsed_url.scheme and not parsed_url.scheme.startswith(
                        ("http", "https")
                    ):
                        return JsonResponse(invalid_response)

                    # Verificar se o URL possui um domínio válido
                    if not parsed_url.netloc:
                        return JsonResponse(invalid_response)

                    # Verificar se o URL possui um caminho válido
                    if not parsed_url.path:
                        return JsonResponse(invalid_response)

                except ValueError:
                    return JsonResponse(invalid_response)
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
    return JsonResponse(invalid_response)


@login_required(login_url="login:login", redirect_field_name="next")
def delete_link(request, pk):
    if not request.POST:
        raise Http404()
    POST = request.POST.copy()
    if POST["id"] != "":
        user = TodoItem.objects.filter(pk=pk).first().category.user
        if request.user == user:
            link = LinkToTodoItem.objects.filter(pk=int(POST["id"])).first()
            if link:
                link.delete()
                return JsonResponse({"status": "ok"})
    return JsonResponse({"status": "error"})


@login_required(login_url="login:login", redirect_field_name="next")
def choose_category(request):
    if request.method == "POST":
        POST = request.POST.copy()
        if POST["id"] != "":
            if POST["id"] == "opened":
                categories = Category.objects.filter(user=request.user).exclude(
                    name="Completos"
                )
                categories = list(categories.values("id", "name"))
            else:
                categories = Category.objects.filter(user=request.user).filter(
                    pk=POST["id"]
                )
                categories = list(categories.values("id", "name", "user"))

            if categories:
                print(categories)
                if len(categories) > 1:
                    todos = TodoItem.objects.filter(
                        category__user__pk=request.user.pk
                    ).exclude(category__name="Completos")
                elif len(categories) == 1:
                    todos = TodoItem.objects.filter(category=categories[0]["id"])
                else:
                    return JsonResponse({"status": "error"})
                todos = todos.order_by("date_to_complete")

                # Adicionar os links de LinkToTodo para cada todo relacionada.
                for todo in todos:
                    links = LinkToTodoItem.objects.filter(todo_item=todo)
                    todo.link = links

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
                results = []
                for todo in todos:
                    values = {}
                    for key, value in todo.__dict__.items():
                        if key == "category_id":
                            values["category"] = todo.category.name
                        else:
                            values[key] = value
                    values.pop("_state")
                    results.append(values)
                # ajustar os links
                for todo in results:
                    links = todo["link"]
                    todo["link"] = []
                    for link in links:
                        todo["link"].append(link.__dict__)
                        todo["link"][-1].pop("_state")
                return JsonResponse({"status": "ok", "todos": results})


@login_required(login_url="login:login", redirect_field_name="next")
def check(request):
    if not request.POST:
        raise Http404()
    POST = request.POST.copy()
    if POST["id"] != "":
        todo = TodoItem.objects.filter(pk=POST["id"]).first()
        if todo:
            if todo.category.user == request.user:
                todo.category = (
                    Category.objects.filter(
                        user=User.objects.filter(username=request.user).first(),
                    )
                    .filter(name="Completos")
                    .first()
                )

                todo.is_completed = True
                todo.save()
                return JsonResponse({"status": "ok"})
    return JsonResponse({"status": "error"})
