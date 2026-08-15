from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone # ADD THIS FOR OTP EXPIRY

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    username = None  # <-- remove username completely
    name = models.CharField(max_length=255, blank=True, null=True) # for full name
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email' # login with email
    REQUIRED_FIELDS = ['name'] # only name is required

    objects = UserManager() # use our custom manager

    def __str__(self):
        return self.email


# ADD THIS NEW MODEL BELOW - DOES NOT AFFECT USER
class OTP(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now=True)

    def is_valid(self):
        # OTP valid for 5 minutes
        return (timezone.now() - self.created_at).seconds < 300

    def __str__(self):
        return f"{self.email} - {self.otp}"