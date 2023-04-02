from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = "home"

urlpatterns = [
    path("", views.index, name="home"),
    path("create_category/", views.create_category, name="create_category"),
    path("create_todo/", views.create_todo, name="create_todo"),
    path("delete_todo/<int:pk>/", views.delete_todo, name="delete_todo"),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)