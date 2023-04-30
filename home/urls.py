from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views as v

app_name = "home"

urlpatterns = [
    path("", v.index, name="home"),
    path("redirector/<path:way>", v.redirector, name="redirector"),
    path("delete_todo/<int:pk>/", v.delete_todo, name="delete_todo"),
    path("delete_link/<int:pk>/", v.delete_link, name="delete_link"),
    path("edit_todo/<int:pk>/", v.edit_todo, name="edit_todo"),
    path("add_link/<int:pk>/", v.add_link, name="add_link"),
    path("get_categories/", v.get_categories, name="get_categories"),
    path("choose_category/", v.choose_category, name="choose_category"),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
