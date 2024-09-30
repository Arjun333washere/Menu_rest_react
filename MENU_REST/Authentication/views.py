from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import logout, authenticate, login

User = get_user_model()

#updation
# Assuming you have a Restaurant model with a ForeignKey to the User model
from menu.models import Restaurant  # Adjust the import if needed

# Register View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([AllowAny])
def api_login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if username and password:
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)  # Log the user in
            refresh = RefreshToken.for_user(user)

            # Check if the user owns a restaurant
            try:
                restaurant = Restaurant.objects.get(owner=user)
                has_restaurant = True
                restaurant_id = restaurant.id
            except Restaurant.DoesNotExist:
                has_restaurant = False
                restaurant_id = None

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "has_restaurant": has_restaurant,
                "restaurant_id": restaurant_id
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)
# Token Refresh View (JWT)
@api_view(['POST'])
def token_refresh_view(request):
    refresh_token = request.data.get('refresh')
    
    if refresh_token:
        try:
            refresh = RefreshToken(refresh_token)
            return Response({
                "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

# Logout View
@api_view(['POST'])
def logout_view(request):
    logout(request)  # Logs out the user by clearing their session
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

# Index View (for rendering after successful login)
def your_index_view(request):
    return render(request, 'index.html')  # Update with your actual template
