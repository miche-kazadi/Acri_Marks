
import { Link } from "react-router-dom";

function AdminDashboard() {
  const adminName =
    localStorage.getItem("admin_name") ||
    "Administrateur";

  const stats = [
    {
      title: "Utilisateurs",
      value: "—",
      description: "Producteurs et acheteurs",
      icon: "bi-people",
    },
    {
      title: "Produits",
      value: "—",
      description: "Produits publiés",
      icon: "bi-box-seam",
    },
    {
      title: "Commandes",
      value: "—",
      description: "Toutes les commandes",
      icon: "bi-cart-check",
    },
    {
      title: "Commandes en attente",
      value: "—",
      description: "À traiter",
      icon: "bi-hourglass-split",
    },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">Administration Agri_Mark</h1>
          <p className="text-muted mb-0">
            Bienvenue, {adminName}.
          </p>
        </div>

        <Link to="/" className="btn btn-outline-secondary">
          Retour à l'accueil
        </Link>
      </div>

      <div className="alert alert-info">
        Les statistiques seront connectées à l'API
        d'administration dans la prochaine étape.
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div className="col-12 col-sm-6 col-xl-3" key={stat.title}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-2">{stat.title}</p>
                    <h2 className="fw-bold">{stat.value}</h2>
                    <small className="text-muted">
                      {stat.description}
                    </small>
                  </div>

                  <i
                    className={`bi ${stat.icon} fs-3 text-success`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h2 className="h5 fw-bold">Gestion de la plateforme</h2>

          <p className="text-muted">
            Depuis cet espace, l'administrateur pourra superviser
            les utilisateurs, les produits et les commandes.
          </p>

          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-success" disabled>
              Gérer les utilisateurs
            </button>

            <button className="btn btn-outline-success" disabled>
              Gérer les produits
            </button>

            <button className="btn btn-outline-success" disabled>
              Consulter les commandes
            </button>
          </div>

          <small className="text-muted d-block mt-3">
            Ces fonctionnalités seront activées après la création
            des endpoints d'administration sécurisés.
          </small>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
