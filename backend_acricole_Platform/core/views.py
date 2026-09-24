from django.shortcuts import render
from decimal import Decimal
from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Product, Order
from .serializers import OrderSerializer
from rest_framework.response import Response
from .serializers import LoginSerializer
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(
            data=request.data
        )
        if serializer.is_valid():
            return Response(
                serializer.validated_data,
                status=status.HTTP_200_OK
            )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "Le refresh token est requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"message": "Déconnexion réussie."},
                status=status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {"error": "Refresh token invalide."},
                status=status.HTTP_400_BAD_REQUEST
            )


class OrderCreateView(APIView):
    permission_classes = [IsAuthenticated]
    @transaction.atomic
    def post(self, request):
        product_id = request.data.get("product")
        quantity = request.data.get("quantity")
        if not product_id or not quantity:
            return Response(
                {
                    "error": "Le produit et la quantité sont obligatoires."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            quantity = Decimal(str(quantity))
        except Exception:
            return Response(
                {
                    "error": "La quantité doit être un nombre valide."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        if quantity <= 0:
            return Response(
                {
                    "error": "La quantité doit être supérieure à zéro."
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        product = Product.objects.select_for_update().filter(
            id=product_id
        ).first()

        if not product:
            return Response(
                {
                    "error": "Produit introuvable."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if request.user.role != "ACHETEUR":
            return Response(
                {
                    "error": "Seuls les acheteurs peuvent passer une commande."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if product.status != Product.Status.OPEN:
            return Response(
                {
                    "error": "Ce produit n'est pas disponible à la commande."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity > product.quantity_available:
            return Response(
                {
                    "error": "Quantité insuffisante.",
                    "quantity_available": product.quantity_available
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        unit_price = product.price_per_unit
        total_price = quantity * unit_price

        order = Order.objects.create(
            buyer=request.user,
            product=product,
            quantity=quantity,
            unit_price=unit_price,
            total_price=total_price,
            status=Order.Status.PENDING
        )

        product.quantity_available -= quantity

        if product.quantity_available == 0:
            product.status = Product.Status.SOLD_OUT

        product.save()

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )






class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "Compte créé avec succès.",
                    "user": {
                        "id": user.id,
                        "full_name": user.full_name,
                        "role": user.role,
                        "phone_or_email": user.phone_or_email,
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "full_name": user.full_name,
            "role": user.role,
            "phone_or_email": user.phone_or_email,
        })