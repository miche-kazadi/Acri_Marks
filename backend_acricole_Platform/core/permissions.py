from rest_framework.permissions import BasePermission


class IsProducteur(BasePermission):
    """
    Autorise uniquement les utilisateurs avec le rôle PRODUCTEUR.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "PRODUCTEUR"
        )


class IsAcheteur(BasePermission):
    """
    Autorise uniquement les utilisateurs avec le rôle ACHETEUR.
    """

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "ACHETEUR"
        )

class IsOwnerOrReadOnly(BasePermission):
    """
    Autorise la lecture à tout utilisateur authentifié.
    Pour modifier ou supprimer, seul le propriétaire est autorisé.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return obj.producer == request.user