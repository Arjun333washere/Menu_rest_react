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
        
        menu = serializer.save(restaurant=restaurant)

        # Generate the QR code for the menu
        generate_qr_code(menu)
        
        # serializer.save(restaurant=restaurant)
        
# Public view for accessing the menu without authentication
    @action(detail=True, methods=['get'], permission_classes=[AllowAny], url_path='public')
    def public_menu(self, request, pk=None):
        """
        This view allows unauthenticated users to access the menu by its ID.
        """
        try:
            # Use pk to fetch the restaurant by the associated menu's restaurant
            menu = self.get_object()  # Fetch the Menu object using pk
            restaurant = menu.restaurant  # Get the associated restaurant from the menu

            serializer = MenuSerializer(menu)
            return Response(serializer.data)
        except Restaurant.DoesNotExist:
            return Response({"error": "Restaurant not found."}, status=status.HTTP_404_NOT_FOUND)
        except Menu.DoesNotExist:
            return Response({"error": "Menu not found for this restaurant."}, status=status.HTTP_404_NOT_FOUND)


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

#Checking the qr code exists or not for ui  
    @action(detail=True, methods=['get'], url_path='qr-code-exists')
    def qr_code_exists(self, request, pk=None):
        try:
            menu = self.get_object()  # Fetch the Menu object
            exists = bool(menu.qr_code)  # Check if QR code exists
            return Response({"qr_code_exists": exists}, status=status.HTTP_200_OK)
        except Menu.DoesNotExist:
            return Response({"error": "Menu not found."}, status=status.HTTP_404_NOT_FOUND)


#ui 
# New action to get the menu ID based on the restaurant ID
    @action(detail=False, methods=['get'], url_path='get-menu-id', permission_classes=[IsAuthenticated])
    def get_menu_id(self, request):
            restaurant_id = request.query_params.get('restaurant_id', None)
            
            if not restaurant_id:
                return Response({"error": "Restaurant ID not provided."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Retrieve the menu based on restaurant ID
                menu = Menu.objects.get(restaurant__id=restaurant_id)
                return Response({"menu_id": menu.id}, status=status.HTTP_200_OK)
            except Menu.DoesNotExist:
                return Response({"error": "Menu not found for this restaurant."}, status=status.HTTP_404_NOT_FOUND)