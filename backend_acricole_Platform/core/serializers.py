from rest_framework import serializers
from .models import Product, Order
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken 

class ProductSerializer(serializers.ModelSerializer):
    producer_name = serializers.CharField(
        source="producer.full_name",
        read_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "category",
            "quantity_total",
            "quantity_available",
            "unit",
            "price_per_unit",
            "available_date",
            "location",
            "description",
            "status",
            "producer_name",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "quantity_available",
            "producer_name",
            "created_at",
            "updated_at",
        ]


class OrderSerializer(serializers.ModelSerializer):

    product_title = serializers.CharField(
        source="product.title",
        read_only=True
    )

    buyer_name = serializers.CharField(
        source="buyer.full_name",
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "buyer",
            "buyer_name",
            "product",
            "product_title",
            "quantity",
            "unit_price",
            "total_price",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "buyer",
            "buyer_name",
            "product_title",
            "unit_price",
            "total_price",
            "status",
            "created_at",
            "updated_at",
        ]

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "phone_or_email",
            "role",
        ]
        read_only_fields = [
            "id",
            "role",
        ]


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "full_name",
            "role",
            "phone_or_email",
            "password",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["phone_or_email"],
            full_name=validated_data["full_name"],
            role=validated_data["role"],
            phone_or_email=validated_data["phone_or_email"],
            password=validated_data["password"],
        )

        return user




class LoginSerializer(serializers.Serializer):

    phone_or_email = serializers.CharField()
    password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        phone_or_email = attrs.get("phone_or_email")
        password = attrs.get("password")

        User = get_user_model()

        try:
            user = User.objects.get(
                phone_or_email=phone_or_email
            )
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Identifiants incorrects, utilisateur que vous avez encrementer n'exite pas!."
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                "le mot de passe encrementer est erroner veillez ressayer svp!"
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "Ce compte est désactivé ou n'exister pratiquement pas!."
            )

        if user.is_active:
            raise serializers.ValidationError("ce compte est operationnel merci de votre fidelite !")

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
    