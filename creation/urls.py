from django.urls import path
from . import views as v

app_name = "creation"

urlpatterns = [
    path("creation/", v.creation, name="creation"),
    path("create_category/", v.create_category, name="create_category"),
    path("delete_category/", v.delete_category, name="delete_category"),
    path("create_todo/", v.create_todo, name="create_todo"),
]
