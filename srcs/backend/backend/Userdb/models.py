from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, Email, Name, Login42, is_admin=False, is_staff=False, password=None):
        if not Email:
            raise ValueError("Users must have an email address")
        if not Name:
            raise ValueError("Users must have an name")
        if not Login42:
            raise ValueError("Users must have an login42")
        if not password:
            raise ValueError("Users must have an password")
        user_obj = self.model(
            Email = self.normalize_email(Email)
        )
        user_obj.Name = Name
        user_obj.Login42 = Login42
        user_obj.Admin = is_admin
        user_obj.is_staff = is_staff
        user_obj.set_password(password)
        user_obj.save(using=self._db)
        return user_obj

    def create_superuser(self, Email, Name, Login42, password=None):
        user = self.create_user(Email, Name, Login42, is_admin=True, is_staff=True, password=password)
        return user
    
    def create_staffuser(self, Email, Name, Login42, password=None):
        user = self.create_user(Email, Name, Login42, is_admin=False, is_staff=True, password=password)
        return user

class User(AbstractBaseUser):
    Name = models.CharField(max_length=80, unique=True)
    Email = models.CharField(max_length=255, unique=True)
    Login42 = models.CharField(max_length=80, unique=True)
    Avatar = models.CharField(max_length=80, default='NULL')
    Name_in_tournement = models.CharField(max_length=80, default='NULL')
    Status_type_id = models.SmallIntegerField(default=0)
    Admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'Email'
    REQUIRED_FIELDS = ['Name', 'Login42']
    def __str__(self):
        return self.Name
    def get_login42(self):
        return self.Name
    def get_avatar(self):
        return self.Name
    def get_name_in_tournement(self):
        return self.Name
    def get_status_type_id(self):
        return self.Name
    def has_perm(self, perm, obj=None):
        return self.Admin
    def has_module_perms(self, app_label):
        return self.Admin