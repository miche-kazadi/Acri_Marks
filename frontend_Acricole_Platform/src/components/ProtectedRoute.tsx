import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  allowedRole?: "ACHETEUR" | "PRODUCTEUR";
};

function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  // Pas connecté
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Connecté mais mauvais rôle
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;