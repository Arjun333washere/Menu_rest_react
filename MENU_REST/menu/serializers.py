from rest_framework import serializers
from .models import Restaurant, FoodItem, Menu

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'description', 'logo']

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ['id', 'restaurant', 'name', 'description', 'price', 'food_type']

class MenuSerializer(serializers.ModelSerializer):
    food_items = serializers.SerializerMethodField()
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)

    class Meta:
        model = Menu
        fields = ['id', 'restaurant', 'restaurant_name', 'food_items','title']

    def get_food_items(self, obj):
        # Fetch the food items related to the restaurant of the menu
        food_items = FoodItem.objects.filter(restaurant=obj.restaurant)
        return FoodItemSerializer(food_items, many=True).data

    def create(self, validated_data):
        return Menu.objects.create(**validated_data)
