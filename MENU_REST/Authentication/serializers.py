from rest_framework import serializers
from .models import CustomUser  # Import your CustomUser model

# Serializer for CustomUser
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type', 'age']

# Serializer for Registering New Users
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser  # Use your CustomUser model here
        fields = ['id', 'username', 'password', 'email', 'user_type', 'age']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            user_type=validated_data['user_type'],
            age=validated_data['age']
        )
        return user
