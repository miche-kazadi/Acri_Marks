
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("user_role");

  const isProducer = role === "PRODUCTEUR";

  const homePath = isProducer ? "/producteur" : "/acheteur";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");

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
                  <Link
                    to="/producteur#publier-produit"
                    className="nav-link"
                  >
                    Publier un produit
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/producteur#mes-produits"
                    className="nav-link"
                  >
                    Mes produits
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/producteur#commandes-recues"
                    className="nav-link"
                  >
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
                  <Link
                    to="/acheteur/commandes"
                    className="nav-link"
                  >
                    Mes commandes
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item ms-lg-3">
              <button
                onClick={handleLogout}
                className="btn btn-outline-light"
              >
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
