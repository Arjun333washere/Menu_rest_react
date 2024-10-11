from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES =(                        #c
        ('manager', 'Manager'),
        ('owner', 'Owner'),
        ('chef', 'Chef'),
        ('waiter', 'Waiter'),
    )
    
    email = models.EmailField(null=True, blank=True)
    mobile_number = models.CharField(max_length=15, default='', null=False)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)

    def __str__(self):
        return self.username
