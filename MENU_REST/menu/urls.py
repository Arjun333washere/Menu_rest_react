from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, FoodItemViewSet, MenuViewSet

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)
router.register(r'food-items', FoodItemViewSet)
router.register(r'menus', MenuViewSet)

urlpatterns = [
    path('', include(router.urls)),

]
