# Create your models here.
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Restaurant(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=45)
    logo = models.ImageField(upload_to='restaurant_logos/', null=True, blank=True)
    description = models.TextField(null=True, blank=True)  # New description field

    #c
    address = models.CharField(max_length=255, null=True, blank=True)  # Non-mandatory address field
    phone_number = models.CharField(max_length=15, null=True, blank=True)  # Non-mandatory phone number field
    
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
    #c
    VEGETARIAN_CHOICES = [
        ('veg', 'Vegetarian'),
        ('non_veg', 'Non-Vegetarian'),
    ]

    restaurant = models.ForeignKey(Restaurant, related_name='food_items', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    fd_description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    food_type = models.CharField(max_length=20, choices=FOOD_TYPE_CHOICES)

    #veg_or_non_veg = models.CharField(max_length=10, choices=[('veg', 'Vegetarian'), ('non_veg', 'Non-Vegetarian')], default='non_veg')  # Set default to 'veg'
    special = models.BooleanField(default=False)  # Non-mandatory field indicating if the food item is special

    def __str__(self):
        return self.name

class Menu(models.Model):
    restaurant = models.OneToOneField(Restaurant, related_name='menu', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='menu_qr_codes/', null=True, blank=True)
    
    mn_description = models.TextField(null=True, blank=True)  # Description of the restaurant

    def __str__(self):
        return self.title
