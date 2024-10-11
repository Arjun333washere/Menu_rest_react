from rest_framework import serializers
from .models import CustomUser  # Import your CustomUser model

# Serializer for CustomUser
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email','mobile_number', 'user_type'] # Updated to include mobile_number

# Serializer for Registering New Users
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser  # Use your CustomUser model here
        fields = ['id', 'username', 'password','confirm_password','mobile_number', 'email', 'user_type'] # Updated to include mobile_number

    def validate(self, data):
        # Check if password and confirm password match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data


    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password as it’s not needed
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            mobile_number=validated_data['mobile_number'],  # Using mobile_number
            email=validated_data.get('email'),  # Email is now optional
            user_type=validated_data['user_type'],
        )
        return user

"""     def validate_mobile_number(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Mobile number must be 10 digits long.")
        return value """
