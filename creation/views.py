from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.http import Http404
from home.models import Category, TodoItem, LinkToTodoItem
from home.forms import CategoryForm, TodoItemForm
from django.http import JsonResponse
from urllib.parse import urlparse
from datetime import datetime


# Create your views here.
@login_required(login_url="login:login", redirect_field_name="next")
def creation(request):
    categories = Category.objects.filter(user=request.user).exclude(name="Completos")
    return render(
        request, "creation/page/index.html", context={"categories": categories}
    )


@login_required(login_url="login:login", redirect_field_name="next")
def create_category(request):
    if not request.POST:
        raise Http404()
    POST = request.POST
    POST._mutable = True
    POST["user"] = request.user

    if POST["category"] != "":
        if POST["Category"] in Category.objects.filter(user=request.user):
            return JsonResponse(
                {"status": "error", "errors": "Categoria já existente."}
            )
        Category.objects.create(name=POST["category"], user=request.user)
        id = Category.objects.filter(user=request.user).order_by("-id")[0].id
        return JsonResponse({"status": "ok", "name": POST["category"], "id": id})
    else:
        return JsonResponse(
            {"status": "error", "errors": "Nome da categoria não pode ser vazio"}
        )


@login_required(login_url="login:login", redirect_field_name="next")
def delete_category(request):
    if not request.POST:
        raise Http404()
    pk = request.POST.get("id", None)
    if pk and pk != "":
        category = Category.objects.get(pk=pk)
        if category.user != request.user:
            return JsonResponse(
                {"status": "error", "errors": "Categoria não encontrada"}
            )
        category.delete()
        return JsonResponse({"status": "ok"})
    else:
        return JsonResponse({"status": "error", "errors": "Categoria não encontrada"})


@login_required(login_url="login:login", redirect_field_name="next")
def create_todo(request):
    if not request.POST:
        raise Http404()
    POST = request.POST.copy()
    title = POST.get("title", None)
    description = POST.get("description", None)
    date = POST.get("date", None)
    category = POST.get("category", None)
    if title and title != "":
        title = title.strip()
        invalid_data = {
            "status": "error",
            "errors": "Data inválida",
        }
        if date and date != "":
            try:
                date = datetime.strptime(date, "%Y-%m-%d")
            except Exception:
                return JsonResponse(invalid_data)
        else:
            JsonResponse(invalid_data)
        if category not in [
            str(c.id) for c in Category.objects.filter(user=request.user)
        ]:
            return JsonResponse({"status": "error", "errors": "Categoria inválida"})
        TodoItem.objects.create(
            title=title,
            description=description,
            date_to_complete=date,
            category=Category.objects.get(pk=category),
            date_created=datetime.now(),
            date_updated=datetime.now(),
        )
        return JsonResponse(
            {
                "status": "ok",
            }
        )
    else:
        return JsonResponse({"status": "error", "errors": "Título não pode ser vazio"})
