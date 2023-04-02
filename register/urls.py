from django.urls import path
from . import views

app_name = 'register'

urlpatterns = [
    path('', views.register_view, name='register'),
    path('create/', views.register_create, name='create'),
]