import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import useTheme from "../hooks/useTheme";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("user_role");
  const { theme, toggle } = useTheme();

  const isProducer = role === "PRODUCTEUR";
  const homePath = isProducer ? "/producteur" : "/acheteur";

  const [avatar, setAvatar] = useState<string | null>(null);
  const [initial, setInitial] = useState("?");

  useEffect(() => {
    AuthService.getProfile()
      .then((p) => {
        setAvatar(p.avatar || null);
        setInitial((p.full_name || p.phone_or_email || "?").charAt(0).toUpperCase());
      })
      .catch(() => {
        /* la navbar reste utilisable sans photo */
      });
  }, []);

  const handleLogout = () => {
    [
      "access_token",
      "refresh_token",
      "user_role",
      "is_staff",
      "is_superuser",
    ].forEach((key) => localStorage.removeItem(key));

    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-success navbar-dark">
      <div className="container">
        <Link to={homePath} className="navbar-brand fw-bold">
          🌾 Agri_Mark
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Afficher la navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {isProducer ? (
              <>
                <li className="nav-item">
                  <Link to="/producteur" className="nav-link">
                    Tableau de bord
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/producteur#publier-produit" className="nav-link">
                    Publier un produit
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/producteur#mes-produits" className="nav-link">
                    Mes produits
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/producteur#commandes-recues" className="nav-link">
                    Commandes reçues
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/acheteur" className="nav-link">
                    Catalogue
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/acheteur/commandes" className="nav-link">
                    Mes commandes
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              <button
                type="button"
                onClick={toggle}
                className="btn btn-outline-light"
                aria-label={
                  theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"
                }
                title={theme === "dark" ? "Mode clair" : "Mode sombre"}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </li>

            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <Link
                to="/profil"
                className="nav-link d-flex align-items-center gap-2"
                title="Mon profil"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Ma photo de profil"
                    className="rounded-circle border border-light"
                    style={{ width: 34, height: 34, objectFit: "cover" }}
                  />
                ) : (
                  <span
                    className="rounded-circle bg-light text-success fw-bold d-inline-flex align-items-center justify-content-center"
                    style={{ width: 34, height: 34 }}
                  >
                    {initial}
                  </span>
                )}
                <span>Mon profil</span>
              </Link>
            </li>

            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <button onClick={handleLogout} className="btn btn-outline-light">
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;