from rest_framework import serializers
from .models import Product, Order
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken 
from django.contrib.auth.password_validation import validate_password


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
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "phone_or_email",
            "role",
            "avatar",
            "is_staff",
            "is_superuser",
        ]
        read_only_fields = [
            "id",
            "role",
            "is_staff",
            "is_superuser",
        ]

    def validate_avatar(self, value):
        if value is None:
            return value
        if value.size > 2 * 1024 * 1024:
            raise serializers.ValidationError("L'image ne doit pas dépasser 2 Mo.")
        return value

    def update(self, instance, validated_data):
        new_contact = validated_data.get("phone_or_email")
        if new_contact:
            instance.username = new_contact

        # Supprime l'ancienne photo du disque quand on la remplace ou la retire
        if "avatar" in validated_data and instance.avatar:
            instance.avatar.delete(save=False)

        return super().update(instance, validated_data)

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
                "Ce compte est désactivé."
            )

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=100,
        trim_whitespace=True
    )
    email = serializers.EmailField()
    subject = serializers.CharField(
        max_length=150,
        trim_whitespace=True
    )
    message = serializers.CharField(
        max_length=3000,
        trim_whitespace=True
    )

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Le nom est obligatoire."
            )
        return value

    def validate_subject(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Le sujet est obligatoire."
            )
        return value

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Le message doit contenir au moins 10 caractères."
            )
        return value
class AdminCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "full_name",
            "phone_or_email",
            "password",
        ]

    def create(self, validated_data):
        user = User.objects.create_superuser(
            username=validated_data["phone_or_email"],
            full_name=validated_data["full_name"],
            phone_or_email=validated_data["phone_or_email"],
            password=validated_data["password"],
            role=User.Role.ACHETEUR,
        )
        return user


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "full_name",
            "phone_or_email",
            "role",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "full_name",
            "phone_or_email",
            "role",
            "is_staff",
            "is_superuser",
            "created_at",
        ]



class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("L'ancien mot de passe est incorrect.")
        return value

    def validate_new_password(self, value):
        validate_password(value, self.context["request"].user)
        return value