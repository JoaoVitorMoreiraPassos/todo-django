from django import forms
from django.contrib.auth.models import User
import re

from django.core.exceptions import ValidationError


def add_attr(field, attr_name, attr_new_val):
    existing = field.widget.attrs.get(attr_name, '')
    field.widget.attrs[attr_name] = f'{existing} {attr_new_val}'.strip()


def add_placeholder(field, placeholder_val):
    add_attr(field, 'placeholder', placeholder_val)

class LoginForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        add_placeholder(self.fields['username'], 'Seu Usuário')
        add_placeholder(self.fields['password'], 'Sua Senha')

    username = forms.CharField(
        widget=forms.TextInput(),
        label='Usuário'
    )
    password = forms.CharField(
        widget=forms.PasswordInput(),
        label="Senha"
    )