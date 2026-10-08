import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-success navbar-dark">
      <div className="container">

        <Link
          to="/acheteur"
          className="navbar-brand fw-bold"
        >
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
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link
                to="/acheteur"
                className="nav-link"
              >
                🏠 Accueil
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/acheteur/commandes"
                className="nav-link"
              >
                📦 Mes commandes
              </Link>
            </li>

            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="btn btn-outline-light ms-lg-3"
              >
                🚪 Déconnexion
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;