from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

import re
def strong_password(password):
    regex = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$')

    if not regex.match(password):
        raise ValidationError((
            'A senha deve conter no minimo uma letra maiuscula, ',
            'uma letra minuscula, um numero e no minimo 8 caracteres'
        ),
        code='Invalid',
        )

class RegisterForm(forms.ModelForm):
    first_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
            'placeholder': 'Seu Nome',
            }
        ),
        label='Nome'
    )
    last_name = forms.CharField(
        widget=forms.TextInput(
            attrs={
            'placeholder': 'Seu Sobrenome',
            }
        ),
        label='Sobrenome'
    )
    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
            'placeholder': 'Seu Usuário',
            }
        ),
        label='Usuário'
    )
    email = forms.EmailField(
        widget=forms.EmailInput(
            attrs={
            'placeholder': 'Seu Email',
            }
        ),
        label='Email'
    )
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
            'placeholder': 'Sua Senha ',
            }
        ),
        label='Senha', 
        validators=[strong_password]
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
            'placeholder': 'Confirme sua senha',
            }
        ),
        label='Confirme sua Senha'
    )
    
    class Meta: 
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password']

        def save(self, commit=True):
            user = super(RegisterForm, self).save(commit=False)
            user.set_password(self.cleaned_data['password'])
            if commit:
                user.save()
            return user
        
    def clean_password(self):
        data = self.cleaned_data.get('password')
        print("here idiot: ", data)

        if ' ' in data:
            raise ValidationError('Senha não pode conter a palavra %(value)s',
                                        code='invalid_password',
                                        params={'value': '"atenção"'},)
        if len(data) < 8:
            raise ValidationError('Senha deve ter no mínimo 8 caracteres')
        if data.isnumeric():
            raise ValidationError('Senha deve conter letras e números')
        if data.isalpha():
            raise ValidationError('Senha deve conter letras e números')
        if data.islower():
            raise ValidationError('Senha deve conter letras maiúsculas e minúsculas')
        if data.isupper():
            raise ValidationError('Senha deve conter letras maiúsculas e minúsculas')
        if data.isalnum():
            raise ValidationError('Senha deve conter caracteres especiais')
        
        return data
    
    def clean_username(self):
        user = self.cleaned_data.get('username')
        exists = User.objects.filter(username=user)
        
        if exists:
            raise ValidationError('Usuário já cadastrado')
        
        return user
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        exists = User.objects.filter(email=email)
        
        if exists:
            raise ValidationError('Email já cadastrado')
        
        return email
    
    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()
        password = cleaned_data.get('password')
        password2 = cleaned_data.get('password2')
        if password != password2:
            raise ValidationError({
                'password2':
                    ValidationError(
                        'Senhas não conferem', 
                        code='invalid_password'
                ) 
            })