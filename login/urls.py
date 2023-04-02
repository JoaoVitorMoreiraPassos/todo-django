from . import views
from django.urls import path, include

app_name = 'login'

urlpatterns = [
    path('', views.login_view, name='login'),
    path('authorize/', views.login_authorize, name='authorize'),
    path('', include('home.urls'))
]