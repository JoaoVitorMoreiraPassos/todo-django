from .models import *
from django import forms


class CategoryForm(forms.ModelForm):
    
    name = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Nome da Categoria'
            }    
        ),
        label='Nome da Categoria'
    )
    
    user = forms.ModelChoiceField(
        queryset=User.objects.all(),
        widget=forms.HiddenInput(),
        label=""
    )
    
    class Meta:
        model = Category
        fields = ['name', 'user']
        

class TodoItemForm(forms.ModelForm):
    title = forms.CharField(
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Título'
            }    
        ),
        label='Título'
    )
    
    description = forms.CharField(
        widget=forms.Textarea(
            attrs={
                'placeholder': 'Descrição'
            }    
        ),
        label='Descrição'
    )
    
    date_to_complete = forms.DateTimeField(
        widget=forms.DateTimeInput(
            attrs={
                'placeholder': 'Data para Concluir'
            }    
        ),
        label='Data para Concluir'
    )
    
    category = forms.ModelChoiceField(
        queryset=Category.objects.none(),
        widget=forms.Select(
            attrs={
                'placeholder': 'Categoria'
            }    
        ),
        label='Categoria'
    )

    
    class Meta:
        model = TodoItem
        fields = ['title', 'description', 'date_to_complete', 'category']
        
    def __init__(self, user, *args, **kwargs):
        super(TodoItemForm, self).__init__(*args, **kwargs)
        print(user, type(user))
        self.fields['category'].queryset = Category.objects.filter(user=user)