import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ProtectedRoute from "./components/ProtectedRoute";
import AcheteurHome from './pages/buyer/home';
import ProduitDetail from "./pages/buyer/produitdetail";
import Orders from "./pages/buyer/Orders";
import BuyerLayout from "./pages/buyer/BuyerLayout";

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
  return (
    <div className="container py-5">
      <h1>🌾 Espace Producteur</h1>
      <p>Bienvenue dans votre espace producteur.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Routes publiques */}
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
        </Route>

        {/* Route par défaut */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;