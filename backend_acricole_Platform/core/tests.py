
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User
from django.test import TestCase
from .models import User


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