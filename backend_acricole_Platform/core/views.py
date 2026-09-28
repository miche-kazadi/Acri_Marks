from django.shortcuts import render
from decimal import Decimal
from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from .models import Product, Order
from rest_framework.response import Response
from .serializers import LoginSerializer
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsAcheteur, IsProducteur
from .serializers import OrderSerializer, ProductSerializer
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination

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
    permission_classes = [IsAuthenticated,IsAcheteur]
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

class ProductListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated(), IsProducteur()]

    def get(self, request):
        products = Product.objects.all()

        search = request.query_params.get("search")

        if search:
            products = products.filter(
                Q(title__icontains=search)
            )

        category = request.query_params.get("category")

        if category:
            products = products.filter(
                category__iexact=category
            )
        location = request.query_params.get("location")

        if location:
            products = products.filter(
                location__icontains=location
            )

        available_date = request.query_params.get("available_date")
        if available_date:
            products = products.filter(
                available_date=available_date
            )

        products = products.order_by("-created_at")
        paginator = PageNumberPagination()
        paginator.page_size = 10
        page = paginator.paginate_queryset(products,request)
        serializer = ProductSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


        
    def post(self, request):
        if request.user.role != "PRODUCTEUR":
            return Response(
                {
                    "error": "Seuls les producteurs peuvent créer un produit."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            product = serializer.save(
                producer=request.user,
                quantity_available=serializer.validated_data["quantity_total"]
            )

            return Response(
                ProductSerializer(product).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class ProductCreateView(APIView):
    permission_classes = [IsAuthenticated, IsProducteur]

    def post(self, request):
        serializer = ProductSerializer(data=request.data)

        if serializer.is_valid():
            product = serializer.save(
                producer=request.user,
                quantity_available=serializer.validated_data["quantity_total"]
            )

            return Response(
                ProductSerializer(product).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        product = Product.objects.filter(pk=pk).first()

        if not product:
            return Response(
                {"error": "Produit introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProductSerializer(product)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def patch(self, request, pk):
        product = Product.objects.filter(pk=pk).first()

        if not product:
            return Response(
                {"error": "Produit introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentification requise."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if request.user.role != "PRODUCTEUR":
            return Response(
                {"error": "Seuls les producteurs peuvent modifier un produit."},
                status=status.HTTP_403_FORBIDDEN
            )

        if product.producer != request.user:
            return Response(
                {"error": "Vous ne pouvez modifier que vos propres produits."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProductSerializer(
            product,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            product = serializer.save()

            return Response(
                ProductSerializer(product).data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        product = Product.objects.filter(pk=pk).first()
        if not product:
            return Response(
                {"error": "Produit introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentification requise."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if request.user.role != "PRODUCTEUR":
            return Response(
                {"error": "Seuls les producteurs peuvent supprimer un produit."},
                status=status.HTTP_403_FORBIDDEN
            )

        if product.producer != request.user:
            return Response(
                {"error": "Vous ne pouvez supprimer que vos propres produits."},
                status=status.HTTP_403_FORBIDDEN
            )

        product.delete()
        return Response(
            {"message": "Produit supprimé avec succès."},
            status=status.HTTP_204_NO_CONTENT
        )