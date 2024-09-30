# Create your models here.
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Restaurant(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='restaurant_logos/', null=True, blank=True)
    description = models.TextField(null=True, blank=True)  # New description field

    
    def __str__(self):
        return self.name

class FoodItem(models.Model):
    FOOD_TYPE_CHOICES = [
        ('dessert', 'Dessert'),
        ('drink', 'Drink'),
        ('main_course', 'Main Course'),
        ('appetizer', 'Appetizer'),
        ('side', 'Side'),
    ]

    restaurant = models.ForeignKey(Restaurant, related_name='food_items', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    food_type = models.CharField(max_length=20, choices=FOOD_TYPE_CHOICES)

    def __str__(self):
        return self.name

class Menu(models.Model):
    restaurant = models.OneToOneField(Restaurant, related_name='menu', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='menu_qr_codes/', null=True, blank=True)

    def __str__(self):
        return self.title
