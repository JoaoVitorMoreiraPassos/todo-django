from django.contrib import admin
from .models import Category, TodoItem
# Register your models here.


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    ...
    
@admin.register(TodoItem)
class TodoItemAdmin(admin.ModelAdmin):
    ...