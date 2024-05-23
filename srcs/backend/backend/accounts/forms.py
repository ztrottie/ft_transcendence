from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core import validators

User = get_user_model()

class RegisterForm(forms.ModelForm):
    """Form par defaut"""

    password = forms.CharField(widget=forms.PasswordInput)
    password_2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)
    Email = forms.EmailField(max_length=254)

    class Meta:
        model = User
        fields = ['Name', 'Email', 'Login42']
    
    def clean_email(self):
        """Checker si le email est deja existant dans la db"""

        email = self.cleaned_data.get('Email')
        qs = User.objects.filter(email=email)
        if qs.exists():
            raise forms.ValidationError("This email is already taken")
        return email
    
    def clean_name(self):
        """Checker si le email est deja existant dans la db"""

        name = self.cleaned_data.get('Name')
        qs = User.objects.filter(name=name)
        if qs.exists():
            raise forms.ValidationError("This name is already taken")
        return name

    def clean(self):
        """Checker si les deux mdp match"""

        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password_2 = cleaned_data.get("password_2")
        if password is not None and password != password_2:
            self.add_error("password_2", "Your passwords must match")
        return cleaned_data
    
    def save(self, commit=True):
        """Save the user with the hashed password"""
        
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user
    
class UserAdminCreationForm(forms.ModelForm):
    """Form pour creer un nouvel user"""
    password = forms.CharField(widget=forms.PasswordInput)
    password_2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['Name', 'Email', 'Login42']

    def clean(self):
        """Checker si les deux mdp match"""
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password_2 = cleaned_data.get("password_2")
        if password is not None and password != password_2:
            self.add_error("password_2", "Your passwords must match")
        return cleaned_data

    def save(self, commit=True):
        """Sauvegarde le mdp dans la db en la cachant"""
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class UserAdminChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ['Name', 'Email', 'Login42', 'Admin']

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]