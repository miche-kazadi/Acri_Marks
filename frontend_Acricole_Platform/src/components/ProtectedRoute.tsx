
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  allowedRole?: "ACHETEUR" | "PRODUCTEUR";
  requireAdmin?: boolean;
};

function ProtectedRoute({
  allowedRole,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");
  const isStaff = localStorage.getItem("is_staff") === "true";
  const isSuperuser = localStorage.getItem("is_superuser") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !(isStaff && isSuperuser)) {
    if (role === "ACHETEUR") {
      return <Navigate to="/acheteur" replace />;
    }

    if (role === "PRODUCTEUR") {
      return <Navigate to="/producteur" replace />;
    }

    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === "ACHETEUR") {
      return <Navigate to="/acheteur" replace />;
    }

    if (role === "PRODUCTEUR") {
      return <Navigate to="/producteur" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
