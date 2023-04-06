from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = "home"

urlpatterns = [
    path("", views.index, name="home"),
    path("delete_todo/<int:pk>/", views.delete_todo, name="delete_todo"),
    path("delete_link/<int:pk>/", views.delete_link, name="delete_link"),
    path("edit_todo/<int:pk>/", views.edit_todo, name="edit_todo"),
    path("add_link/<int:pk>/", views.add_link, name="add_link"),
    path("create_category/", views.create_category, name="create_category"),
    path("create_todo/", views.create_todo, name="create_todo"),
    path("<path:way>", views.redirector, name="redirector"),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)