
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, Product, Order


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "role",
        "is_active",
        "is_staff",
    )
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("username", "email", "full_name")
    ordering = ("id",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "producer",
        "category",
        "quantity_total",
        "quantity_available",
        "unit",
        "price_per_unit",
        "available_date",
        "location",
        "status",
    )

    list_filter = (
        "category",
        "status",
        "available_date",
    )

    search_fields = (
        "title",
        "producer__full_name",
        "location",
        "description",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    date_hierarchy = "available_date"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "buyer",
        "product",
        "quantity",
        "unit_price",
        "total_price",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "buyer__full_name",
        "buyer__username",
        "product__title",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "unit_price",
        "total_price",
        "created_at",
        "updated_at",
    )

    date_hierarchy = "created_at"
