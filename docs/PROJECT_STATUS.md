# 📊 Agri_Mark — État du projet

> Dernière mise à jour : septembre 2026

## 🎯 Objectif du projet

Agri_Mark est une plateforme qui met en relation les producteurs agricoles/piscicoles avec les acheteurs.

L'objectif est de permettre aux producteurs de publier leurs futures récoltes et aux acheteurs de réserver les produits avant leur arrivée en ville.

---

# 🔐 BACKEND — Authentification

## ✅ Terminé

* [x] Projet Django créé
* [x] Application `core`
* [x] Modèle utilisateur personnalisé `User`
* [x] Rôle `PRODUCTEUR`
* [x] Rôle `ACHETEUR`
* [x] Inscription
* [x] Connexion avec JWT
* [x] Endpoint `/api/v1/auth/me/`
* [x] Configuration Django REST Framework
* [x] Configuration Simple JWT
* [x] Migrations de la base de données

## ⬜ À faire

* [ ] Endpoint `/api/v1/auth/logout/`
* [ ] Vérification complète des permissions par rôle
* [ ] Tests automatisés de l'authentification

---

# 🌾 BACKEND — Produits

## ✅ Terminé

* [x] Modèle `Product`
* [x] Catégorie Agriculture
* [x] Catégorie Pisciculture
* [x] Quantité totale
* [x] Quantité disponible
* [x] Unité
* [x] Prix par unité
* [x] Date de disponibilité
* [x] Localisation
* [x] Description
* [x] Statut du produit
* [x] `ProductSerializer`

## ⬜ À faire

* [ ] `GET /api/v1/products/`
* [ ] `GET /api/v1/products/:id/`
* [ ] `POST /api/v1/products/`
* [ ] `PATCH /api/v1/products/:id/`
* [ ] `DELETE /api/v1/products/:id/`
* [ ] Recherche par nom
* [ ] Filtre par catégorie
* [ ] Filtre par localisation
* [ ] Filtre par date de disponibilité
* [ ] Pagination
* [ ] Vérifier que seul le producteur propriétaire peut modifier son produit
* [ ] Vérifier que seul le producteur propriétaire peut supprimer son produit

---

# 🛒 BACKEND — Commandes

## 🔄 En cours

* [x] Modèle `Order`
* [x] `OrderSerializer`
* [x] Création d'une commande
* [x] Vérification de la quantité disponible
* [x] Calcul automatique du prix total
* [x] Déduction de la quantité disponible
* [x] Passage automatique à `SOLD_OUT`
* [x] `transaction.atomic`
* [x] `select_for_update`

## ⬜ À faire

* [ ] `GET /api/v1/orders/my-orders/`
* [ ] `GET /api/v1/orders/:id/`
* [ ] `POST /api/v1/orders/:id/cancel/`
* [ ] Gestion des changements de statut
* [ ] Vérification des permissions acheteur/producteur
* [ ] Empêcher un acheteur de commander son propre produit
* [ ] Tests des commandes

---

# 👨‍🌾 BACKEND — Producteur

## ⬜ À faire

* [ ] `GET /api/v1/producer/orders/`
* [ ] Afficher les commandes des produits du producteur
* [ ] Vérifier que le producteur ne voit que ses propres commandes
* [ ] Gestion des statuts des commandes

---

# 👤 BACKEND — Profil

## ⬜ À faire

* [ ] `GET /api/v1/profile/`
* [ ] `PATCH /api/v1/profile/`
* [ ] Modifier les informations du profil
* [ ] Vérifier les permissions

---

# 🧪 BACKEND — Tests

## ⬜ À faire

* [ ] Tests du modèle `User`
* [ ] Tests Register
* [ ] Tests Login
* [ ] Tests `/auth/me/`
* [ ] Tests Product
* [ ] Tests création commande
* [ ] Test quantité insuffisante
* [ ] Test produit SOLD_OUT
* [ ] Tests permissions
* [ ] Tests annulation commande

---

# 💻 FRONTEND — React

## 🔄 En développement

Le frontend React/Vite est déjà initialisé.

## ⬜ À vérifier / compléter

* [ ] Connexion à l'API
* [ ] Gestion du JWT
* [ ] Inscription
* [ ] Connexion
* [ ] Liste des produits
* [ ] Recherche et filtres
* [ ] Détail produit
* [ ] Création produit
* [ ] Mes produits
* [ ] Création commande
* [ ] Mes commandes
* [ ] Dashboard producteur
* [ ] Profil
* [ ] Protection des routes
* [ ] Gestion des erreurs API
* [ ] États de chargement

---

# 🔗 API

Base URL de développement :

```text
http://localhost:8000/api/v1
```

Documentation de l'API :

```text
docs/CONTRACT.md
```

---

# 🌿 GIT — Collaboration

## Règle principale

Ne pas développer directement sur `master`.

Chaque fonctionnalité doit avoir sa propre branche.

Exemple :

```bash
git checkout -b feature/products-api
```

Puis :

```bash
git add .
git commit -m "feat: ajout de l'API produits"
git push origin feature/products-api
```

Ensuite créer une Pull Request vers `master`.

---

# 🚦 Légende

| Symbole | Signification |
| ------- | ------------- |
| ✅       | Terminé       |
| 🔄      | En cours      |
| ⬜       | À faire       |
| 🐛      | Bug           |
| ⏸️      | Bloqué        |

---

# 📌 Priorités

1. Produits API
2. Commandes API
3. Permissions
4. Commandes producteur
5. Profil
6. Tests backend
7. Intégration complète frontend/backend
8. Tests finaux
9. Déploiement
