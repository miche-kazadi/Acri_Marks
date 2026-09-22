# 🌱 Contrat d'API — Plateforme Agricole & Piscicole

## 1. Présentation

Cette API permet de connecter directement les producteurs agricoles et piscicoles aux acheteurs afin de permettre la publication et la précommande de productions disponibles à une date future.

### Types d'utilisateurs

La plateforme possède actuellement deux rôles principaux :

* `PRODUCTEUR` : agriculteur ou pisciculteur qui publie ses productions.
* `ACHETEUR` : particulier, restaurant, marchand ou grossiste qui précommande les productions.

Un troisième rôle pourra être ajouté ultérieurement :

* `ADMIN` : administration et modération de la plateforme.

---

# 2. Configuration générale

## Base URL — Développement

```text
http://localhost:8000/api/v1
```

## Format

Toutes les requêtes et réponses utilisent le format :

```text
JSON
```

## Headers

Pour les requêtes contenant un body :

```http
Content-Type: application/json
```

Pour les endpoints nécessitant une authentification :

```http
Authorization: Bearer <token>
```

Exemple :

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

# 3. Convention des réponses

## Réponse réussie

```json
{
  "success": true,
  "message": "Opération réussie.",
  "data": {}
}
```

## Réponse avec erreur

```json
{
  "success": false,
  "message": "Une erreur est survenue."
}
```

Les erreurs de validation peuvent contenir des détails supplémentaires :

```json
{
  "success": false,
  "message": "Les données envoyées sont invalides.",
  "errors": {
    "email": [
      "Cette adresse email est déjà utilisée."
    ]
  }
}
```

---

# 4. Codes HTTP utilisés

| Code  | Signification         |
| ----- | --------------------- |
| `200` | Requête réussie       |
| `201` | Ressource créée       |
| `400` | Données invalides     |
| `401` | Non authentifié       |
| `403` | Accès interdit        |
| `404` | Ressource introuvable |
| `409` | Conflit               |
| `500` | Erreur serveur        |

---

# 5. Authentification

## POST `/auth/register/`

### Description

Créer un nouveau compte Producteur ou Acheteur.

### Request Body

```json
{
  "full_name": "Wichey Kaiz",
  "phone_or_email": "michemubikay31@gmail.com",
  "password": "Password123!",
  "role": "PRODUCTEUR"
}
```

### Valeurs possibles pour `role`

```text
PRODUCTEUR
ACHETEUR
```

### Response `201 Created`

```json
{
  "success": true,
  "message": "Compte créé avec succès.",
  "user": {
    "id": 1,
    "full_name": "Wichey Kaiz",
    "phone_or_email": "michemubikay31@gmail.com",
    "role": "PRODUCTEUR"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response `400 Bad Request`

```json
{
  "success": false,
  "message": "Les données envoyées sont invalides.",
  "errors": {
    "phone_or_email": [
      "Cette adresse email ou ce numéro de téléphone est déjà utilisé."
    ]
  }
}
```

---

# 6. Connexion

## POST `/auth/login/`

### Description

Connecter un utilisateur existant.

### Request Body

```json
{
  "phone_or_email": "michemubikay31@gmail.com",
  "password": "Password123!"
}
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Connexion réussie.",
  "user": {
    "id": 1,
    "full_name": "Wichey Kaiz",
    "phone_or_email": "michemubikay31@gmail.com",
    "role": "PRODUCTEUR"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response `401 Unauthorized`

```json
{
  "success": false,
  "message": "Identifiants invalides."
}
```

---

# 7. Utilisateur connecté

## GET `/auth/me/`

### Description

Récupérer les informations de l'utilisateur actuellement connecté.

### Headers

```http
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Wichey Kaiz",
    "phone_or_email": "michemubikay31@gmail.com",
    "role": "PRODUCTEUR"
  }
}
```

### Response `401 Unauthorized`

```json
{
  "success": false,
  "message": "Authentification requise."
}
```

---

# 8. Déconnexion

## POST `/auth/logout/`

### Description

Déconnecter l'utilisateur actuel.

### Headers

```http
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Déconnexion réussie."
}
```

---

# 9. Produits / Productions

> Dans cette première version, une ressource `product` représente une production future publiée par un producteur.

Exemple :

```text
500 kg de manioc disponibles le 10 octobre.
```

Une séparation entre `Product` et `Production` pourra être introduite dans une version ultérieure.

---

# 10. Liste des productions

## GET `/products/`

### Description

Récupérer les productions disponibles en précommande.

Cet endpoint est public.

### Response `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "title": "Tilapia frais",
      "category": "PISCICULTURE",
      "quantity_total": 150,
      "quantity_available": 150,
      "unit": "kg",
      "price_per_unit": 5000,
      "available_date": "2026-10-05",
      "location": "Kikwit",
      "producer": {
        "id": 1,
        "name": "Ferme Musole"
      },
      "status": "OPEN"
    },
    {
      "id": 102,
      "title": "Maïs blanc frais",
      "category": "AGRICULTURE",
      "quantity_total": 500,
      "quantity_available": 500,
      "unit": "kg",
      "price_per_unit": 1200,
      "available_date": "2026-10-12",
      "location": "Kimpese",
      "producer": {
        "id": 2,
        "name": "Agro Mwamba"
      },
      "status": "OPEN"
    }
  ]
}
```

---

# 11. Détail d'une production

## GET `/products/:id/`

### Description

Récupérer les détails d'une production.

### Exemple

```http
GET /api/v1/products/101/
```

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 101,
    "title": "Tilapia frais",
    "category": "PISCICULTURE",
    "quantity_total": 150,
    "quantity_available": 130,
    "unit": "kg",
    "price_per_unit": 5000,
    "available_date": "2026-10-05",
    "location": "Kikwit",
    "description": "Tilapia frais disponible après récolte.",
    "producer": {
      "id": 1,
      "name": "Ferme Musole"
    },
    "status": "OPEN"
  }
}
```

### Response `404 Not Found`

```json
{
  "success": false,
  "message": "Production introuvable."
}
```

---

# 12. Publier une production

## POST `/products/`

### Description

Publier une nouvelle production à venir.

Endpoint réservé aux utilisateurs ayant le rôle :

```text
PRODUCTEUR
```

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "title": "Maïs blanc frais",
  "category": "AGRICULTURE",
  "quantity_total": 500,
  "unit": "kg",
  "price_per_unit": 1200,
  "available_date": "2026-10-12",
  "location": "Kimpese",
  "description": "Maïs blanc fraîchement récolté."
}
```

### Valeurs possibles pour `category`

```text
AGRICULTURE
PISCICULTURE
```

### Exemple de valeurs pour `unit`

```text
kg
sac
tonne
pièce
régime
caisse
```

La liste pourra être étendue ultérieurement.

### Response `201 Created`

```json
{
  "success": true,
  "message": "Production publiée avec succès.",
  "data": {
    "id": 103,
    "title": "Maïs blanc frais",
    "category": "AGRICULTURE",
    "quantity_total": 500,
    "quantity_available": 500,
    "unit": "kg",
    "price_per_unit": 1200,
    "available_date": "2026-10-12",
    "location": "Kimpese",
    "description": "Maïs blanc fraîchement récolté.",
    "producer": {
      "id": 1,
      "name": "Wichey Farm"
    },
    "status": "OPEN"
  }
}
```

---

# 13. Modifier une production

## PATCH `/products/:id/`

### Description

Modifier une production appartenant au producteur connecté.

### Headers

```http
Authorization: Bearer <token>
```

### Exemple

```json
{
  "price_per_unit": 1300,
  "available_date": "2026-10-15"
}
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Production modifiée avec succès.",
  "data": {
    "id": 103,
    "title": "Maïs blanc frais",
    "price_per_unit": 1300,
    "available_date": "2026-10-15"
  }
}
```

---

# 14. Supprimer une production

## DELETE `/products/:id/`

### Description

Supprimer une production appartenant au producteur connecté.

Une production ayant déjà des précommandes pourra être interdite à la suppression et devra éventuellement être annulée.

### Response `200 OK`

```json
{
  "success": true,
  "message": "Production supprimée avec succès."
}
```

---

# 15. Statuts des productions

Les productions peuvent avoir les statuts suivants :

```text
DRAFT
OPEN
SOLD_OUT
COMPLETED
CANCELLED
```

### DRAFT

Production créée mais pas encore publiée.

### OPEN

Production disponible pour les précommandes.

### SOLD_OUT

Toute la quantité disponible a été réservée.

### COMPLETED

Production arrivée et distribution terminée.

### CANCELLED

Production annulée.

---

# 16. Précommandes

## POST `/orders/`

### Description

Créer une précommande sur une production.

Endpoint réservé aux acheteurs authentifiés.

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "product_id": 101,
  "quantity": 20
}
```

### Règles

Le backend doit vérifier :

1. que le produit existe ;
2. que le produit est `OPEN` ;
3. que la quantité demandée est supérieure à `0` ;
4. que la quantité demandée ne dépasse pas `quantity_available` ;
5. que l'utilisateur est un `ACHETEUR`.

### Exemple

Production :

```text
150 kg disponibles
```

Commande :

```text
20 kg
```

Après réservation :

```text
quantity_available = 130 kg
```

### Response `201 Created`

```json
{
  "success": true,
  "message": "Précommande enregistrée avec succès.",
  "data": {
    "id": 5001,
    "product_id": 101,
    "quantity": 20,
    "unit": "kg",
    "unit_price": 5000,
    "total_price": 100000,
    "status": "PENDING",
    "created_at": "2026-09-22T09:00:00Z"
  }
}
```

---

# 17. Quantité insuffisante

## Response `400 Bad Request`

Si un acheteur demande plus que la quantité disponible :

```json
{
  "success": false,
  "message": "Quantité insuffisante.",
  "errors": {
    "quantity": [
      "Il ne reste que 10 kg disponibles."
    ]
  }
}
```

---

# 18. Mes précommandes

## GET `/orders/my-orders/`

### Description

Récupérer les précommandes de l'utilisateur connecté.

### Headers

```http
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 5001,
      "product": {
        "id": 101,
        "title": "Tilapia frais"
      },
      "quantity": 20,
      "unit": "kg",
      "unit_price": 5000,
      "total_price": 100000,
      "status": "PENDING",
      "available_date": "2026-10-05",
      "created_at": "2026-09-22T09:00:00Z"
    }
  ]
}
```

---

# 19. Détail d'une précommande

## GET `/orders/:id/`

### Description

Récupérer le détail d'une précommande appartenant à l'utilisateur connecté.

### Response `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 5001,
    "product": {
      "id": 101,
      "title": "Tilapia frais"
    },
    "quantity": 20,
    "unit": "kg",
    "unit_price": 5000,
    "total_price": 100000,
    "status": "PENDING",
    "available_date": "2026-10-05",
    "location": "Kikwit",
    "created_at": "2026-09-22T09:00:00Z"
  }
}
```

---

# 20. Annuler une précommande

## POST `/orders/:id/cancel/`

### Description

Permettre à un acheteur d'annuler une précommande avant son traitement.

### Headers

```http
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "success": true,
  "message": "Précommande annulée avec succès."
}
```

Lorsque la commande est annulée, la quantité réservée doit être remise dans la quantité disponible.

Exemple :

```text
Avant annulation :

quantity_available = 130 kg

Commande annulée :

+ 20 kg

Après :

quantity_available = 150 kg
```

---

# 21. Précommandes reçues par un producteur

## GET `/producer/orders/`

### Description

Permettre à un producteur de consulter les précommandes concernant ses productions.

### Headers

```http
Authorization: Bearer <token>
```

### Response `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 5001,
      "product": {
        "id": 101,
        "title": "Tilapia frais"
      },
      "buyer": {
        "id": 10,
        "name": "Restaurant La Bonne Fourchette"
      },
      "quantity": 20,
      "unit": "kg",
      "total_price": 100000,
      "status": "PENDING",
      "created_at": "2026-09-22T09:00:00Z"
    }
  ]
}
```

---

# 22. Statuts des commandes

Les commandes utilisent les statuts suivants :

```text
PENDING
CONFIRMED
READY
COMPLETED
CANCELLED
```

### PENDING

Précommande créée mais pas encore confirmée par le producteur.

### CONFIRMED

Producteur ayant confirmé la précommande.

### READY

Produit disponible pour récupération ou distribution.

### COMPLETED

Commande terminée.

### CANCELLED

Commande annulée.

---

# 23. Profil utilisateur

## GET `/profile/`

### Description

Récupérer le profil de l'utilisateur connecté.

### Headers

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Wichey Kaiz",
    "phone_or_email": "michemubikay31@gmail.com",
    "role": "PRODUCTEUR"
  }
}
```

---

# 24. Modifier son profil

## PATCH `/profile/`

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "full_name": "Wichey Farm",
  "phone_or_email": "contact@wicheyfarm.com"
}
```

### Response

```json
{
  "success": true,
  "message": "Profil mis à jour avec succès.",
  "data": {
    "id": 1,
    "full_name": "Wichey Farm",
    "phone_or_email": "contact@wicheyfarm.com",
    "role": "PRODUCTEUR"
  }
}
```

---

# 25. Pagination

Les endpoints retournant plusieurs éléments pourront utiliser la pagination.

Exemple :

```http
GET /products/?page=1&page_size=20
```

Réponse :

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

La pagination sera implémentée lorsque le volume de données le nécessitera.

---

# 26. Recherche et filtres

La liste des productions pourra être filtrée.

### Recherche

```http
GET /products/?search=manioc
```

### Catégorie

```http
GET /products/?category=AGRICULTURE
```

### Localisation

```http
GET /products/?location=Kimpese
```

### Date de disponibilité

```http
GET /products/?available_date=2026-10-12
```

### Combinaison

```http
GET /products/?category=AGRICULTURE&location=Kimpese
```

---

# 27. Modèle simplifié des relations

```text
USER
 │
 ├── PRODUCTEUR
 │      │
 │      └── PRODUCTS
 │             │
 │             ├── ORDER
 │             ├── ORDER
 │             └── ORDER
 │
 └── ACHETEUR
        │
        └── ORDERS
```

Une production appartient à un producteur.

Une précommande appartient à un acheteur.

Une précommande concerne une production.

---

# 28. Règles métier importantes

## Producteur

Un utilisateur `PRODUCTEUR` peut :

* créer une production ;
* modifier ses propres productions ;
* supprimer ses propres productions si aucune règle métier ne l'interdit ;
* consulter les précommandes de ses productions ;
* confirmer une précommande.

## Acheteur

Un utilisateur `ACHETEUR` peut :

* consulter les productions ;
* créer une précommande ;
* consulter ses précommandes ;
* annuler ses propres précommandes selon les règles définies.

## Sécurité

Un utilisateur ne doit jamais pouvoir :

* modifier la production d'un autre producteur ;
* consulter les commandes privées d'un autre acheteur ;
* créer une production avec un compte `ACHETEUR` ;
* créer une commande avec un compte `PRODUCTEUR`.

Toutes ces règles doivent être contrôlées par le backend.

---

# 29. Architecture future

Cette première version constitue le MVP.

Les fonctionnalités suivantes pourront être ajoutées plus tard :

```text
Paiements
Notifications
Messagerie
Évaluations
Favoris
Livraison
Géolocalisation
Vérification des producteurs
Photos des productions
Documents de vérification
Statistiques
Dashboard avancé
```

Elles ne font pas partie du MVP initial.

---

# 30. Version API

L'API utilise actuellement :

```text
/api/v1/
```

Si une modification majeure incompatible avec la version actuelle est nécessaire, une nouvelle version pourra être créée :

```text
/api/v2/
```

L'objectif est de préserver la compatibilité entre le frontend et le backend.

---

# 31. Exemple de parcours complet

### Producteur

```text
REGISTER
    ↓
LOGIN
    ↓
CREATE PRODUCT
    ↓
PRODUCT = OPEN
    ↓
WAIT FOR ORDERS
    ↓
CONFIRM ORDER
    ↓
PRODUCT = READY
    ↓
COMPLETE ORDER
```

### Acheteur

```text
REGISTER
    ↓
LOGIN
    ↓
GET PRODUCTS
    ↓
VIEW PRODUCT
    ↓
CREATE ORDER
    ↓
WAIT FOR CONFIRMATION
    ↓
ORDER = READY
    ↓
COLLECT / RECEIVE PRODUCT
    ↓
ORDER = COMPLETED
```

---

# 32. MVP — Fonctionnalités prioritaires

La première version doit se concentrer sur :

```text
1. Inscription
2. Connexion
3. Profil utilisateur
4. Rôles Producteur / Acheteur
5. Publication d'une production
6. Liste des productions
7. Détail d'une production
8. Précommande
9. Gestion de la quantité disponible
10. Historique des commandes
11. Gestion des commandes côté producteur
```

Les paiements, notifications, livraison, messagerie et évaluations seront développés après validation du MVP.
