from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=65)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name


class TodoItem(models.Model):
    title = models.CharField(max_length=65)
    description = models.TextField()
    date_created = models.DateField(auto_now_add=True)
    date_updated = models.DateField(auto_now=True)
    date_to_complete = models.DateField()
    is_completed = models.BooleanField(default=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class LinkToTodoItem(models.Model):
    title = models.CharField(max_length=65)
    url = models.URLField()
    todo_item = models.ForeignKey(TodoItem, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
