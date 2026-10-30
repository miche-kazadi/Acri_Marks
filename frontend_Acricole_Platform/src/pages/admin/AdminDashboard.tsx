import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import Api from "../../services/Api";
import AdminService, {
  type AdminStats,
  type AdminUser,
  type Paginated,
} from "../../services/adminService";

import ThemeToggle from "../../components/ThemeToggle";

type Tab = "stats" | "users" | "products" | "orders" | "admins";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "stats", label: "Statistiques", icon: "📊" },
  { id: "users", label: "Utilisateurs", icon: "👥" },
  { id: "products", label: "Produits", icon: "🌾" },
  { id: "orders", label: "Commandes", icon: "📦" },
  { id: "admins", label: "Administrateurs", icon: "🛡️" },
];

const PRODUCT_STATUS: Record<string, string> = {
  DRAFT: "Brouillon",
  OPEN: "Ouvert",
  SOLD_OUT: "Épuisé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

const ORDER_STATUS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  READY: "Prête",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const CATEGORY_LABEL: Record<string, string> = {
  AGRICULTURE: "Agriculture",
  PISCICULTURE: "Pisciculture",
};

const ROLE_LABEL: Record<string, string> = {
  PRODUCTEUR: "Producteur",
  ACHETEUR: "Acheteur",
};

function errMsg(err: any): string {
  const data = err?.response?.data;
  if (!err?.response) return "Impossible de contacter le serveur.";
  if (typeof data === "string") return data;
  if (data?.error) return data.error;
  if (data?.detail) return data.detail;
  return "Une erreur est survenue.";
}

function formatNumber(value: number | string): string {
  const n = Number(value);
  return Number.isNaN(n) ? String(value) : n.toLocaleString("fr-FR");
}

/* Attend que l'utilisateur arrête de taper avant de lancer la recherche */
function useDebounced<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ===================== PAGINATION ===================== */

function Pager({
  page,
  data,
  onChange,
}: {
  page: number;
  data: Paginated<any> | null;
  onChange: (page: number) => void;
}) {
  if (!data) return null;

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
      <span className="text-muted small">{data.count} résultat(s)</span>
      <div className="btn-group">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          disabled={!data.previous}
          onClick={() => onChange(page - 1)}
        >
          ← Précédent
        </button>
        <button type="button" className="btn btn-outline-secondary btn-sm" disabled>
          Page {page}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          disabled={!data.next}
          onClick={() => onChange(page + 1)}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

function TableLoading({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-4 text-muted">
        Chargement…
      </td>
    </tr>
  );
}

/* ===================== STATISTIQUES ===================== */

function StatsTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    AdminService.getStats()
      .then(setStats)
      .catch((err) => setError(errMsg(err)));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <p className="text-muted">Chargement des statistiques…</p>;

  const groups = [
    {
      title: "Utilisateurs",
      cards: [
        { label: "Total", value: stats.users.total, icon: "👥" },
        { label: "Producteurs", value: stats.users.producers, icon: "🌾" },
        { label: "Acheteurs", value: stats.users.buyers, icon: "🛒" },
      ],
    },
    {
      title: "Produits",
      cards: [
        { label: "Total", value: stats.products.total, icon: "📋" },
        { label: "Ouverts", value: stats.products.open, icon: "🟢" },
        { label: "Épuisés", value: stats.products.sold_out, icon: "🔴" },
      ],
    },
    {
      title: "Commandes",
      cards: [
        { label: "Total", value: stats.orders.total, icon: "📦" },
        { label: "En attente", value: stats.orders.pending, icon: "⏳" },
        { label: "Confirmées", value: stats.orders.confirmed, icon: "✅" },
        { label: "Terminées", value: stats.orders.completed, icon: "🏁" },
      ],
    },
  ];

  return (
    <>
      {groups.map((group) => (
        <div key={group.title} className="mb-4">
          <h2 className="h6 text-uppercase text-muted mb-3">{group.title}</h2>
          <div className="row g-3">
            {group.cards.map((card) => (
              <div className="col-6 col-lg-3" key={card.label}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted small">{card.label}</span>
                      <span className="fs-3">{card.icon}</span>
                    </div>
                    <p className="display-6 fw-bold mb-0 mt-2">
                      {formatNumber(card.value)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ===================== UTILISATEURS ===================== */

function UsersTab() {
  const [data, setData] = useState<Paginated<AdminUser> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounced(search);

  const load = useCallback(() => {
    setLoading(true);
    AdminService.getUsers({
      page,
      search: debouncedSearch || undefined,
      role: role || undefined,
    })
      .then((result) => {
        setData(result);
        setError("");
      })
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, role]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(user: AdminUser) {
    try {
      await AdminService.setUserActive(user.id, !user.is_active);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  }

  async function remove(user: AdminUser) {
    if (
      !window.confirm(
        `Supprimer définitivement ${user.full_name || user.phone_or_email} ?`,
      )
    ) {
      return;
    }

    try {
      await AdminService.deleteUser(user.id);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  }

  return (
    <>
      <div className="mb-3">
        <h2 className="h5 mb-1">Gestion des utilisateurs</h2>
        <p className="text-muted mb-0">
          Rechercher et filtrer les comptes de la plateforme.
        </p>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <label htmlFor="user-search" className="form-label">
            Rechercher un utilisateur
          </label>
          <input
            id="user-search"
            type="search"
            className="form-control"
            placeholder="Nom, e-mail ou téléphone"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="user-role-filter" className="form-label">
            Filtrer par rôle
          </label>
          <select
            id="user-role-filter"
            className="form-select"
            value={role}
            onChange={(event) => {
              setPage(1);
              setRole(event.target.value);
            }}
          >
            <option value="">Tous les rôles</option>
            <option value="PRODUCTEUR">Producteurs</option>
            <option value="ACHETEUR">Acheteurs</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Contact</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && !data && <TableLoading colSpan={6} />}
              {data?.results.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.full_name || "—"}</td>
                  <td>{user.phone_or_email || "—"}</td>
                  <td>
                    {user.is_superuser ? (
                      <span className="badge text-bg-dark">Admin</span>
                    ) : (
                      <span className="badge text-bg-secondary">
                        {ROLE_LABEL[user.role] || "—"}
                      </span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${user.is_active ? "text-bg-success" : "text-bg-danger"
                        }`}
                    >
                      {user.is_active ? "Actif" : "Désactivé"}
                    </span>
                  </td>
                  <td className="text-end">
                    {!user.is_superuser && (
                      <div className="d-flex justify-content-end gap-2 flex-wrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => toggle(user)}
                        >
                          {user.is_active ? "Désactiver" : "Activer"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(user)}
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {data && data.results.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pager page={page} data={data} onChange={setPage} />
    </>
  );
}

/* ===================== PRODUITS ===================== */

function ProductsTab() {
  const [data, setData] = useState<Paginated<any> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounced(search);

  const load = useCallback(() => {
    setLoading(true);
    AdminService.getProducts({
      page,
      search: debouncedSearch || undefined,
      status: status || undefined,
      category: category || undefined,
    })
      .then((result) => {
        setData(result);
        setError("");
      })
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch, status, category]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id: number, newStatus: string) {
    try {
      await AdminService.updateProduct(id, { status: newStatus });
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  }

  async function remove(product: any) {
    if (!window.confirm(`Supprimer le produit « ${product.title} » ?`)) return;

    try {
      await AdminService.deleteProduct(product.id);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  }

  return (
    <>
      <div className="mb-3">
        <h2 className="h5 mb-1">Gestion des produits</h2>
        <p className="text-muted mb-0">
          Rechercher les produits et modifier leur statut.
        </p>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-5">
          <input
            type="search"
            className="form-control"
            placeholder="Rechercher un produit ou un producteur"
            aria-label="Rechercher un produit ou un producteur"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            aria-label="Filtrer par statut"
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value);
            }}
          >
            <option value="">Tous les statuts</option>
            {Object.entries(PRODUCT_STATUS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            aria-label="Filtrer par catégorie"
            value={category}
            onChange={(event) => {
              setPage(1);
              setCategory(event.target.value);
            }}
          >
            <option value="">Toutes catégories</option>
            <option value="AGRICULTURE">Agriculture</option>
            <option value="PISCICULTURE">Pisciculture</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produit</th>
                <th>Producteur</th>
                <th>Catégorie</th>
                <th>Stock</th>
                <th>Prix unitaire</th>
                <th>Statut</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && !data && <TableLoading colSpan={8} />}
              {data?.results.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{product.producer_name}</td>
                  <td>{CATEGORY_LABEL[product.category] || product.category}</td>
                  <td>
                    {formatNumber(product.quantity_available)} /{" "}
                    {formatNumber(product.quantity_total)} {product.unit}
                  </td>
                  <td>{formatNumber(product.price_per_unit)}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={product.status}
                      onChange={(event) =>
                        changeStatus(product.id, event.target.value)
                      }
                      aria-label={`Statut du produit ${product.title}`}
                    >
                      {Object.entries(PRODUCT_STATUS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => remove(product)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {data && data.results.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted">
                    Aucun produit trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pager page={page} data={data} onChange={setPage} />
    </>
  );
}

/* ===================== COMMANDES ===================== */

function OrdersTab() {
  const [data, setData] = useState<Paginated<any> | null>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    AdminService.getOrders({ page, status: status || undefined })
      .then((result) => {
        setData(result);
        setError("");
      })
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id: number, newStatus: string) {
    try {
      await AdminService.updateOrderStatus(id, newStatus);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  }

  return (
    <>
      <div className="mb-3">
        <h2 className="h5 mb-1">Gestion des commandes</h2>
        <p className="text-muted mb-0">
          Consulter et mettre à jour les commandes.
        </p>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <label htmlFor="order-status-filter" className="form-label">
            Filtrer par statut
          </label>
          <select
            id="order-status-filter"
            className="form-select"
            value={status}
            onChange={(event) => {
              setPage(1);
              setStatus(event.target.value);
            }}
          >
            <option value="">Tous les statuts</option>
            {Object.entries(ORDER_STATUS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>N°</th>
                <th>Acheteur</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && !data && <TableLoading colSpan={7} />}
              {data?.results.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.buyer_name}</td>
                  <td>{order.product_title}</td>
                  <td>{formatNumber(order.quantity)}</td>
                  <td>{formatNumber(order.total_price)}</td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.status}
                      onChange={(event) =>
                        changeStatus(order.id, event.target.value)
                      }
                      aria-label={`Statut de la commande ${order.id}`}
                    >
                      {Object.entries(ORDER_STATUS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
              {data && data.results.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    Aucune commande trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pager page={page} data={data} onChange={setPage} />
    </>
  );
}

/* ===================== ADMINISTRATEURS ===================== */

function AdminsTab() {
  const [fullName, setFullName] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await Api.post("/admin/create/", {
        full_name: fullName.trim(),
        phone_or_email: phoneOrEmail.trim().toLowerCase(),
        password,
      });

      setSuccess(response.data.message || "Administrateur créé avec succès.");
      setFullName("");
      setPhoneOrEmail("");
      setPassword("");
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError(
          "Accès refusé : seuls les superadministrateurs peuvent créer un administrateur.",
        );
      } else if (err?.response?.data) {
        const responseData = err.response.data;
        setError(
          typeof responseData === "object"
            ? Object.values(responseData).flat().map(String).join(" ")
            : String(responseData),
        );
      } else {
        setError("Impossible de contacter le serveur.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card border-0 shadow-sm" style={{ maxWidth: 560 }}>
      <div className="card-body p-4">
        <h2 className="h5 mb-2">Créer un administrateur</h2>
        <p className="text-muted mb-4">
          Ajouter un compte administrateur à la plateforme.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="admin-full-name" className="form-label">
              Nom complet
            </label>
            <input
              id="admin-full-name"
              className="form-control"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              maxLength={150}
              autoComplete="name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="admin-contact" className="form-label">
              E-mail ou téléphone
            </label>
            <input
              id="admin-contact"
              className="form-control"
              value={phoneOrEmail}
              onChange={(event) => setPhoneOrEmail(event.target.value)}
              required
              maxLength={150}
              autoComplete="username"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="admin-password" className="form-label">
              Mot de passe (8 caractères minimum)
            </label>
            <input
              id="admin-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Création en cours…" : "Créer le compte administrateur"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ===================== TABLEAU DE BORD PRINCIPAL ===================== */

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("stats");
  const navigate = useNavigate();

  function logout() {
    // On supprime uniquement les données de session,
    // pour conserver le choix du mode sombre/clair.
    [
      "access_token",
      "refresh_token",
      "user_role",
      "is_staff",
      "is_superuser",
    ].forEach((key) => localStorage.removeItem(key));

    navigate("/login", { replace: true });
  }

  return (
    <main className="container py-4">
      <header className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <span className="badge text-bg-dark mb-2">Espace administrateur</span>
          <h1 className="h3 fw-bold mb-1">Administration Agri_Mark</h1>
          <p className="text-muted mb-0">
            Gérez votre plateforme agricole depuis un seul espace.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <ThemeToggle />
          <Link to="/profil" className="btn btn-outline-success">
            👤 Mon profil
          </Link>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={logout}
          >
            Se déconnecter
          </button>
        </div>
      </header>

      <nav aria-label="Navigation d'administration">
        <ul className="nav nav-pills mb-4 flex-wrap gap-2">
          {TABS.map((item) => (
            <li className="nav-item" key={item.id}>
              <button
                type="button"
                className={`nav-link ${tab === item.id ? "active bg-success" : "text-success"
                  }`}
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id ? "page" : undefined}
              >
                <span className="me-1">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section>
        {tab === "stats" && <StatsTab />}
        {tab === "users" && <UsersTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "admins" && <AdminsTab />}
      </section>

      <footer className="mt-5 pt-3 border-top">
        <p className="text-muted small mb-0">
          Agri_Mark · Administration de la plateforme
        </p>
      </footer>
    </main>
  );
}

export default AdminDashboard;