from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        PRODUCTEUR = "PRODUCTEUR", "Producteur"
        ACHETEUR = "ACHETEUR", "Acheteur"

    full_name = models.CharField(max_length=150)

    role = models.CharField(
        max_length=20,
        choices=Role.choices
    )

    phone_or_email = models.CharField(
        max_length=150,
        unique=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.full_name} ({self.role})"
# Create your models here.

class Product(models.Model):

    class Category(models.TextChoices):
        AGRICULTURE = "AGRICULTURE", "Agriculture"
        PISCICULTURE = "PISCICULTURE", "Pisciculture"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Brouillon"
        OPEN = "OPEN", "Ouvert"
        SOLD_OUT = "SOLD_OUT", "Épuisé"
        COMPLETED = "COMPLETED", "Terminé"
        CANCELLED = "CANCELLED", "Annulé"

    producer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="products"
    )

    title = models.CharField(max_length=200)

    category = models.CharField(
        max_length=20,
        choices=Category.choices
    )

    quantity_total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    quantity_available = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    unit = models.CharField(max_length=50)

    price_per_unit = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    available_date = models.DateField()

    location = models.CharField(max_length=200)

    description = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title


class Order(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "En attente"
        CONFIRMED = "CONFIRMED", "Confirmée"
        READY = "READY", "Prête"
        COMPLETED = "COMPLETED", "Terminée"
        CANCELLED = "CANCELLED", "Annulée"

    buyer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    total_price = models.DecimalField(
        max_digits=14,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"Commande #{self.id} - {self.product.title}"
