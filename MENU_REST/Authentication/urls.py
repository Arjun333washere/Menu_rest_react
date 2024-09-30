from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, logout_view, your_index_view, api_login_view

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', logout_view, name='logout'),
    path('api/login/', api_login_view, name='api_login'),  # API login URL
    path('index/', your_index_view, name='index'),
]
