from rest_framework import serializers
from .models import Restaurant, FoodItem, Menu

class RestaurantSerializer(serializers.ModelSerializer):
    has_menu = serializers.SerializerMethodField()
    has_qr_code = serializers.SerializerMethodField()  
    
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'description', 'logo','address', 'phone_number', 'has_menu','has_qr_code']

    def get_has_menu(self, obj):
        # Check if the restaurant has a menu
        return Menu.objects.filter(restaurant=obj).exists()
    
    def get_has_qr_code(self, obj):
        menu = Menu.objects.filter(restaurant=obj).first()
        if not menu:
            return None  # Return None if no menu exists
        if menu.qr_code:  # Check if the QR code exists
            return True
        return False  # Return False if the menu exists but no QR code


class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ['id', 'restaurant', 'name', 'fd_description', 'price', 'food_type', 'special']

class MenuSerializer(serializers.ModelSerializer):
    food_items = serializers.SerializerMethodField()
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)

    class Meta:
        model = Menu
        fields = ['id', 'restaurant', 'restaurant_name', 'food_items','title','mn_description']

    def get_food_items(self, obj):
        # Fetch the food items related to the restaurant of the menu
        food_items = FoodItem.objects.filter(restaurant=obj.restaurant)
        return FoodItemSerializer(food_items, many=True).data

    def create(self, validated_data):
        return Menu.objects.create(**validated_data)
