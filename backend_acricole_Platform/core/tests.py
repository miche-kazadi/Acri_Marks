
from rest_framework.test import APITestCase
from rest_framework import status
from django.test import TestCase
from .models import User, Product, Order

class UserModelTest(TestCase):

    def test_create_user_producteur(self):
        user = User.objects.create_user(
            username="producteur_test",
            full_name="Producteur Test",
            role="PRODUCTEUR",
            phone_or_email="producteur@test.com",
            password="password123"
        )

        self.assertEqual(user.full_name, "Producteur Test")
        self.assertEqual(user.role, "PRODUCTEUR")
        self.assertEqual(user.phone_or_email, "producteur@test.com")
        self.assertTrue(user.check_password("password123"))
        self.assertTrue(user.is_active)



class UserModelTest(TestCase):

    def test_create_user_producteur(self):
        user = User.objects.create_user(
            username="producteur_test",
            full_name="Producteur Test",
            role="PRODUCTEUR",
            phone_or_email="producteur@test.com",
            password="password123"
        )

        self.assertEqual(user.full_name, "Producteur Test")
        self.assertEqual(user.role, "PRODUCTEUR")
        self.assertEqual(user.phone_or_email, "producteur@test.com")
        self.assertTrue(user.check_password("password123"))
        self.assertTrue(user.is_active)


class RegisterTest(APITestCase):

    def test_register_user(self):
        data = {
            "full_name": "Acheteur Test",
            "role": "ACHETEUR",
            "phone_or_email": "acheteur@test.com",
            "password": "password123"
        }

        response = self.client.post(
            "/api/v1/auth/register/",
            data,
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(
            User.objects.filter(
                phone_or_email="acheteur@test.com"
            ).exists()
        )

class LoginTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="login_test",
            full_name="Login Test",
            role="ACHETEUR",
            phone_or_email="login@test.com",
            password="password123"
        )

    def test_login_user(self):
        data = {
            "phone_or_email": "login@test.com",
            "password": "password123"
        }

        response = self.client.post(
            "/api/v1/auth/login/",
            data,
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

class MeTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="me_test",
            full_name="Me Test",
            role="PRODUCTEUR",
            phone_or_email="me@test.com",
            password="password123"
        )

    def test_me_authenticated(self):
        response = self.client.post(
            "/api/v1/auth/login/",
            {
                "phone_or_email": "me@test.com",
                "password": "password123"
            },
            format="json"
        )

        access_token = response.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        response = self.client.get("/api/v1/auth/me/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["full_name"], "Me Test")
        self.assertEqual(response.data["role"], "PRODUCTEUR")

class LogoutTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="logout_test",
            full_name="Logout Test",
            role="ACHETEUR",
            phone_or_email="logout@test.com",
            password="password123"
        )

    def test_logout_user(self):
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {
                "phone_or_email": "logout@test.com",
                "password": "password123"
            },
            format="json"
        )

        refresh_token = login_response.data["refresh"]
        access_token = login_response.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        response = self.client.post(
            "/api/v1/auth/logout/",
            {
                "refresh": refresh_token
            },
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )
from .permissions import IsProducteur, IsAcheteur


class RolePermissionTest(APITestCase):

    def setUp(self):
        self.producteur = User.objects.create_user(
            username="producteur_permission",
            full_name="Producteur Permission",
            role="PRODUCTEUR",
            phone_or_email="producteur_permission@test.com",
            password="password123"
        )

        self.acheteur = User.objects.create_user(
            username="acheteur_permission",
            full_name="Acheteur Permission",
            role="ACHETEUR",
            phone_or_email="acheteur_permission@test.com",
            password="password123"
        )

    def test_producteur_role(self):
        self.assertEqual(
            self.producteur.role,
            "PRODUCTEUR"
        )

        permission = IsProducteur()

        self.client.force_authenticate(
            user=self.producteur
        )

        request = self.client.get("/api/v1/auth/me/")

        self.assertTrue(
            permission.has_permission(
                request.wsgi_request,
                None
            )
        )

    def test_acheteur_role(self):
        self.assertEqual(
            self.acheteur.role,
            "ACHETEUR"
        )

        permission = IsProducteur()

        self.client.force_authenticate(
            user=self.acheteur
        )

        request = self.client.get("/api/v1/auth/me/")

        self.assertFalse(
            permission.has_permission(
                request.wsgi_request,
                None
            )
        )

class ProducerOrdersTest(APITestCase):

    def setUp(self):
        self.producteur = User.objects.create_user(
            username="producer_orders_test",
            full_name="Producer Orders Test",
            role="PRODUCTEUR",
            phone_or_email="producer_orders@test.com",
            password="password123"
        )

        self.acheteur = User.objects.create_user(
            username="buyer_orders_test",
            full_name="Buyer Orders Test",
            role="ACHETEUR",
            phone_or_email="buyer_orders@test.com",
            password="password123"
        )

        self.product = Product.objects.create(
            producer=self.producteur,
            title="Maïs test",
            category="AGRICULTURE",
            quantity_total=100,
            quantity_available=100,
            unit="kg",
            price_per_unit=10,
            available_date="2026-10-20",
            location="Kimpese",
            description="Produit de test",
            status="OPEN"
        )

        self.order = Order.objects.create(
            buyer=self.acheteur,
            product=self.product,
            quantity=10,
            unit_price=10,
            total_price=100,
            status="PENDING"
        )

    def test_producteur_voit_ses_commandes(self):
        self.client.force_authenticate(
            user=self.producteur
        )

        response = self.client.get(
            "/api/v1/producer/orders/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data),
            1
        )

        self.assertEqual(
            response.data[0]["id"],
            self.order.id
        )

    def test_producteur_ne_voit_pas_les_commandes_des_autres(self):
        autre_producteur = User.objects.create_user(
            username="other_producer",
            full_name="Other Producer",
            role="PRODUCTEUR",
            phone_or_email="other_producer@test.com",
            password="password123"
        )

        autre_product = Product.objects.create(
            producer=autre_producteur,
            title="Riz test",
            category="AGRICULTURE",
            quantity_total=200,
            quantity_available=200,
            unit="kg",
            price_per_unit=20,
            available_date="2026-10-25",
            location="Kinshasa",
            description="Autre produit de test",
            status="OPEN"
        )

        autre_order = Order.objects.create(
            buyer=self.acheteur,
            product=autre_product,
            quantity=20,
            unit_price=20,
            total_price=400,
            status="PENDING"
        )

        self.client.force_authenticate(
            user=self.producteur
        )

        response = self.client.get(
            "/api/v1/producer/orders/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            len(response.data),
            1
        )

        self.assertEqual(
            response.data[0]["id"],
            self.order.id
        )

        self.assertNotEqual(
            response.data[0]["id"],
            autre_order.id
        )

class ProducerOrderStatusTest(APITestCase):

    def setUp(self):
        self.producteur = User.objects.create_user(
            username="producer_status_test",
            full_name="Producer Status Test",
            role="PRODUCTEUR",
            phone_or_email="producer_status@test.com",
            password="password123"
        )

        self.acheteur = User.objects.create_user(
            username="buyer_status_test",
            full_name="Buyer Status Test",
            role="ACHETEUR",
            phone_or_email="buyer_status@test.com",
            password="password123"
        )

        self.product = Product.objects.create(
            producer=self.producteur,
            title="Maïs statut test",
            category="AGRICULTURE",
            quantity_total=100,
            quantity_available=100,
            unit="kg",
            price_per_unit=10,
            available_date="2026-10-20",
            location="Kimpese",
            description="Produit de test",
            status="OPEN"
        )

        self.order = Order.objects.create(
            buyer=self.acheteur,
            product=self.product,
            quantity=10,
            unit_price=10,
            total_price=100,
            status="PENDING"
        )

        self.client.force_authenticate(user=self.producteur)

    def test_producteur_confirme_commande(self):
        response = self.client.patch(
            f"/api/v1/orders/{self.order.id}/status/",
            {"status": "CONFIRMED"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.order.refresh_from_db()

        self.assertEqual(
            self.order.status,
            "CONFIRMED"
        )

    def test_producteur_passe_commande_a_ready(self):
        self.order.status = "CONFIRMED"
        self.order.save()

        response = self.client.patch(
            f"/api/v1/orders/{self.order.id}/status/",
            {"status": "READY"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.order.refresh_from_db()

        self.assertEqual(
            self.order.status,
            "READY"
        )

    def test_producteur_termine_commande(self):
        self.order.status = "READY"
        self.order.save()

        response = self.client.patch(
            f"/api/v1/orders/{self.order.id}/status/",
            {"status": "COMPLETED"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.order.refresh_from_db()

        self.assertEqual(
            self.order.status,
            "COMPLETED"
        )

    def test_transition_invalide_refusee(self):
        response = self.client.patch(
            f"/api/v1/orders/{self.order.id}/status/",
            {"status": "READY"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

        self.order.refresh_from_db()

        self.assertEqual(
            self.order.status,
            "PENDING"
        )

    def test_producteur_ne_peut_pas_modifier_commande_autre_producteur(self):
        autre_producteur = User.objects.create_user(
            username="other_producer_status",
            full_name="Other Producer Status",
            role="PRODUCTEUR",
            phone_or_email="other_producer_status@test.com",
            password="password123"
        )

        autre_product = Product.objects.create(
            producer=autre_producteur,
            title="Riz autre producteur",
            category="AGRICULTURE",
            quantity_total=200,
            quantity_available=200,
            unit="kg",
            price_per_unit=20,
            available_date="2026-10-25",
            location="Kinshasa",
            description="Autre produit",
            status="OPEN"
        )

        autre_order = Order.objects.create(
            buyer=self.acheteur,
            product=autre_product,
            quantity=20,
            unit_price=20,
            total_price=400,
            status="PENDING"
        )

        response = self.client.patch(
            f"/api/v1/orders/{autre_order.id}/status/",
            {"status": "CONFIRMED"},
            format="json"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

        autre_order.refresh_from_db()

        self.assertEqual(
            autre_order.status,
            "PENDING"
        )