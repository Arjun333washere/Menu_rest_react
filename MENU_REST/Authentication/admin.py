from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'mobile_number', 'user_type')
    search_fields = ('username', 'email','mobile_number')
    list_filter = ('user_type',)  # Added filtering by user type
