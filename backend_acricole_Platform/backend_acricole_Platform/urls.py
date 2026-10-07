"""
URL configuration for backend_acricole_Platform project.

The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from core.views import (
    LoginView,
    LogoutView,
    MeView,
    MyOrdersView,
    OrderCreateView,
    OrderDetailView,
    OrderCancelView,
    ProductDetailView,
    ProductListCreateView,
    RegisterView,
    OrderStatusUpdateView,
    ProducerOrdersView,
)


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

    # Produits
    path(
        "api/v1/products/",
        ProductListCreateView.as_view(),
        name="product-list-create"
    ),

    path(
        "api/v1/products/<int:pk>/",
        ProductDetailView.as_view(),
        name="product-detail"
    ),

    # Commandes
    path(
        "api/v1/orders/my-orders/",
        MyOrdersView.as_view(),
        name="my-orders"
    ),
    path(
        "api/v1/orders/<int:pk>/cancel/",
        OrderCancelView.as_view(),
        name="order-cancel"
    ),
    path(
        "api/v1/orders/<int:pk>/status/",
        OrderStatusUpdateView.as_view(),
        name="order-status-update"
    ),

    path(
        "api/v1/orders/<int:pk>/",
        OrderDetailView.as_view(),
        name="order-detail"
    ),
    path(
        "api/v1/orders/",
        OrderCreateView.as_view(),
        name="order-create"
    ),
    path(
    "api/v1/producer/orders/",
    ProducerOrdersView.as_view(),
    name="producer-orders"
),

    # Authentification
    path(
        "api/v1/auth/me/",
        MeView.as_view(),
        name="me"
    ),

    path(
        "api/v1/auth/logout/",
        LogoutView.as_view(),
        name="logout"
    ),
]