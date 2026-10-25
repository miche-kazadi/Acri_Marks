
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  allowedRole?: "ACHETEUR" | "PRODUCTEUR";
};

function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  // Un utilisateur non connecté doit se connecter.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Un utilisateur connecté doit rester dans son espace autorisé.
  if (allowedRole && role !== allowedRole) {
    if (role === "ACHETEUR") {
      return <Navigate to="/acheteur" replace />;
    }

    if (role === "PRODUCTEUR") {
      return <Navigate to="/producteur" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
