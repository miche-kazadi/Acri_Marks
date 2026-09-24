"""
URL configuration for backend_acricole_Platform project.

The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from core.views import LoginView,LogoutView, MeView, OrderCreateView, RegisterView


urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentification
    path(
        "api/v1/auth/register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "api/v1/auth/login/",
        LoginView.as_view(),
        name="token-obtain"
    ),

    path(
        "api/v1/auth/token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh"
    ),

    # Commandes
    path(
        "api/v1/orders/",
        OrderCreateView.as_view(),
        name="order-create"
    ),
    path(
    "api/v1/auth/me/",
    MeView.as_view(),
    name="me"
    ),
    path(
        "api/v1/auth/logout/", 
        LogoutView.as_view(),
         name="logout"),
]