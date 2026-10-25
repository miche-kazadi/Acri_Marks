import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ProtectedRoute from "./components/ProtectedRoute";
import AcheteurHome from './pages/buyer/home';
import ProduitDetail from "./pages/buyer/produitdetail";
import Orders from "./pages/buyer/Orders";
import BuyerLayout from "./pages/buyer/BuyerLayout";
import ProducerOrders from "./pages/producer/Orders";
import CreateProduct from "./pages/producer/CreateProduct";
import MyProduct from "./pages/producer/myProduct";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import ProductService, { type Product } from "./services/ProductService";
import OrderService, { type Order } from "./services/OrderService";
function Dashboard() {
  return (
    <div className="container py-5">
      <h1>Bienvenue sur Agri_Mark 🌾</h1>
      <p>Cette page est protégée.</p>
    </div>
  );
}

// Page temporaire pour tester le rôle ACHETEUR

// Page temporaire pour tester le rôle PRODUCTEUR



function ProducteurDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboardData() {
      try {
        setStatsError("");

        const [productsData, ordersData] = await Promise.all([
          ProductService.getMyProducts(),
          OrderService.getProducerOrders(),
        ]);

        if (!active) return;
        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error(
          "Erreur lors du chargement du tableau de bord :",
          error,
        );

        if (active) {
          setStatsError(
            "Impossible de charger les statistiques. Vérifiez votre connexion.",
          );
        }
      } finally {
        if (active) setLoadingStats(false);
      }
    }

    void loadDashboardData();

    return () => {
      active = false;
    };
  }, []);

  const availableProducts = products.filter(
    (product) => product.status === "OPEN",
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const ordersToPrepare = orders.filter(
    (order) =>
      order.status === "CONFIRMED" ||
      order.status === "READY",
  ).length;

  const statistics = [
    {
      label: "Mes produits",
      value: products.length,
      icon: "🌾",
      description: "Produits enregistrés",
    },
    {
      label: "Disponibles",
      value: availableProducts,
      icon: "🟢",
      description: "Produits ouverts aux réservations",
    },
    {
      label: "En attente",
      value: pendingOrders,
      icon: "📥",
      description: "Commandes à traiter",
    },
    {
      label: "À préparer",
      value: ordersToPrepare,
      icon: "📦",
      description: "Commandes confirmées ou prêtes",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <div className="mb-4">
          <span className="badge text-bg-success mb-2">
            Espace producteur
          </span>

          <h1 className="fw-bold">Bienvenue sur votre tableau de bord 🌾</h1>

          <p className="text-muted">
            Suivez vos produits, gérez les réservations et préparez
            vos prochaines livraisons.
          </p>
        </div>

        {statsError && (
          <div className="alert alert-warning" role="alert">
            {statsError}
          </div>
        )}

        <div className="row g-3 mb-5">
          {statistics.map((stat) => (
            <div className="col-12 col-sm-6 col-xl-3" key={stat.label}>
              <article className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <span className="text-muted small">{stat.label}</span>
                    <span className="fs-3" aria-hidden="true">
                      {stat.icon}
                    </span>
                  </div>

                  <p className="display-6 fw-bold mb-1">
                    {loadingStats ? "…" : statsError ? "—" : stat.value}
                  </p>

                  <p className="text-muted small mb-0">
                    {stat.description}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className="d-flex flex-wrap gap-2 mb-5">
          <a
            href="#publier-produit"
            className="btn btn-success"
          >
            + Publier un produit
          </a>

          <a
            href="#mes-produits"
            className="btn btn-outline-success"
          >
            Gérer mes produits
          </a>

          <a
            href="#commandes-recues"
            className="btn btn-outline-success"
          >
            Voir les commandes
          </a>
        </div>

        <section id="publier-produit" className="mb-5">
          <CreateProduct />
        </section>

        <section id="mes-produits" className="mb-5">
          <MyProduct />
        </section>

        <section id="commandes-recues" className="mb-5">
          <ProducerOrders />
        </section>
      </div>
    </>
  );
}



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Route protégée générale */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Routes ACHETEUR */}
        {/* Routes ACHETEUR */}
        <Route element={<ProtectedRoute allowedRole="ACHETEUR" />}>
          <Route element={<BuyerLayout />}>

            <Route
              path="/acheteur"
              element={<AcheteurHome />}
            />

            <Route
              path="/acheteur/produit/:id"
              element={<ProduitDetail />}
            />

            <Route
              path="/acheteur/commandes"
              element={<Orders />}
            />

          </Route>
        </Route>

        {/* Routes PRODUCTEUR */}

        <Route element={<ProtectedRoute allowedRole="PRODUCTEUR" />}>
          <Route
            path="/producteur"
            element={<ProducteurDashboard />}
          />

          <Route
            path="/producteur/mes-produits"
            element={<MyProduct />}
          />
        </Route>


        {/* Route par défaut */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;