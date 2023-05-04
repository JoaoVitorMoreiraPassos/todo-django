from django.shortcuts import render, redirect
from django.http import Http404
from .forms import RegisterForm
from django.contrib import messages
from django.contrib.auth.models import User
from home.models import Category


# Create your views here.
def register_view(request):
    register_form_data = request.session.get("register_form_data", None)
    form = RegisterForm(register_form_data)

    return render(request, "register/page/register.html", context={"form": form})


def register_create(request):
    if not request.POST:
        raise Http404()

    POST = request.POST
    request.session["register_form_data"] = POST

    form = RegisterForm(POST)
    if form.is_valid():
        form.save()
        user = User.objects.get(username=form.cleaned_data.get("username"))
        user.set_password(form.cleaned_data.get("password"))
        user.save()
        Category.objects.create(name="Completos", user=user)
        messages.success(request, "Usuário criado com sucesso!")

        del request.session["register_form_data"]

    return redirect("register:register")
