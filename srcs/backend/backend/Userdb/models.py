from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password

class StatusType(models.Model):
	StatusTypeId = models.AutoField(primary_key=True)
	Description = models.CharField(max_length=20, null=True)
	
	def __str__(self):
		return self.Description

class UserManager(BaseUserManager):
    def create_user(self, email, name, login42, is_admin=False, is_staff=False, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not name:
            raise ValueError("Users must have an name")
        if not login42:
            raise ValueError("Users must have an login42")
        if not password:
            raise ValueError("Users must have an password")
        user_obj = self.model(
            email=self.normalize_email(email),
            name=name,
            login42=login42,
            admin=is_admin,
            is_staff=is_staff,
        )
        user_obj.set_password(password)
        user_obj.save(using=self._db)
        return user_obj

    def create_superuser(self, email, name, login42, password=None):
        user = self.create_user(email, name, login42, is_admin=True, is_staff=True, password=password)
        return user

    def create_staffuser(self, email, name, login42, password=None):
        user = self.create_user(email, name, login42, is_admin=False, is_staff=True, password=password)
        return user

class User(AbstractBaseUser):
    name = models.CharField(max_length=80, unique=True)
    email = models.CharField(max_length=255, unique=True)
    login42 = models.CharField(max_length=80, unique=True)
    avatar = models.CharField(max_length=80, default='NULL')
    name_in_tournement = models.CharField(max_length=80, default='NULL')
    status_type_id = models.SmallIntegerField(default=0)
    admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, blank=True)
    otp_expiry_time = models.DateTimeField(blank=True, null=True)
    statusTypeId = models.ForeignKey(StatusType, on_delete=models.CASCADE, default="2")

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'login42']
    def __str__(self):
        return self.name
    def get_login42(self):
        return self.login42
    def get_avatar(self):
        return self.avatar
    def get_name_in_tournement(self):
        return self.name_in_tournement
    def get_status_type_id(self):
        return self.status_type_id
    def has_perm(self, perm, obj=None):
        return self.admin
    def has_module_perms(self, app_label):
        return self.admin