# Create your views here.
from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import Restaurant, FoodItem, Menu
from .serializers import RestaurantSerializer, FoodItemSerializer, MenuSerializer
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
#qr code generation
from .utils import generate_qr_code
from rest_framework.decorators import action
from rest_framework.response import Response
#menu ui 
from rest_framework.exceptions import ValidationError
from django.http import HttpResponse
from rest_framework.decorators import action

# Restaurant ViewSet
class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can create/update

    def perform_create(self, serializer):
        # Assign the owner as the currently authenticated user
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)  # Ensure users only see their own restaurants
    
    # New action to check if the user owns a restaurant
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def check_ownership(self, request):
        # Check if the logged-in user owns a restaurant
        if Restaurant.objects.filter(owner=request.user).exists():
            restaurant = Restaurant.objects.get(owner=request.user)
            return Response({
                'has_restaurant': True, 
                'restaurant_id': restaurant.id, 
                'restaurant_name': restaurant.name
            })
        else:
            return Response({'has_restaurant': False})

# FoodItem ViewSet

class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filterset_fields = ('restaurant',)
    ordering_fields = '__all__'


# Menu ViewSet
class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.select_related('restaurant').all()
    serializer_class = MenuSerializer
    permission_classes = [AllowAny]  # Anyone can view the menu

    @action(detail=True, methods=['post'], url_path='generate-qr-code')
    def generate_qr_code(self, request, pk=None):
        try:
            menu = self.get_object()  # Fetch the Menu object
            generate_qr_code(menu)  # Call generate_qr_code with the menu object only
            return Response({"message": "QR code generated successfully."}, status=status.HTTP_200_OK)
        except Menu.DoesNotExist:
            return Response({"error": "Menu not found."}, status=status.HTTP_404_NOT_FOUND)


    #for ui

    def perform_create(self, serializer):
        restaurant = Restaurant.objects.filter(owner=self.request.user).first()
        if not restaurant:
            raise ValidationError({"error": "You must own a restaurant to create a menu."})
        
        # Check if a menu already exists for this restaurant
        if Menu.objects.filter(restaurant=restaurant).exists():
            raise ValidationError({"restaurant": ["Menu with this restaurant already exists."]})
        
        serializer.save(restaurant=restaurant)

    # Public view for accessing the menu without authentication
    @action(detail=True, methods=['get'], permission_classes=[AllowAny], url_path='public')
    def public_menu(self, request, pk=None):
        """
        This view allows unauthenticated users to access the menu by its ID.
        """
        try:
            menu = self.get_object()
            serializer = MenuSerializer(menu)
            return Response(serializer.data)
        except Menu.DoesNotExist:
            return Response({"error": "Menu not found."}, status=status.HTTP_404_NOT_FOUND)



    # Inside the MenuViewSet class
    @action(detail=True, methods=['get'], url_path='download-qr-code')
    def download_qr_code(self, request, pk=None):
        try:
            menu = self.get_object()  # Fetch the Menu object
            img_path = menu.qr_code.path  # Path to the QR code image
            
            with open(img_path, "rb") as img:
                response = HttpResponse(img.read(), content_type="image/png")
                response['Content-Disposition'] = f'attachment; filename="qr_code_{menu.id}.png"'
                return response
        except Menu.DoesNotExist:
            return Response({"error": "Menu not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#QRCODE GENERATING 

